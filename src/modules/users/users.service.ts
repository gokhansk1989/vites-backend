import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto, ChangePasswordDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        city: true,
        role: true,
        status: true,
        ratingAvg: true,
        ratingCount: true,
        salesCount: true,
        isFounder: true,
        phoneVerifiedAt: true,
        emailVerifiedAt: true,
        identityVerifiedAt: true,
        createdAt: true,
        subscription: {
          select: {
            status: true,
            plan: { select: { name: true, slug: true, featuredCredits: true } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getPublicProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null, status: 'ACTIVE' },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        city: true,
        ratingAvg: true,
        ratingCount: true,
        salesCount: true,
        isFounder: true,
        createdAt: true,
        listings: {
          where: { status: 'ACTIVE', deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            images: { take: 1, orderBy: { sortOrder: 'asc' } },
            category: { select: { id: true, name: true } },
          },
        },
        reviewsReceived: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            author: { select: { id: true, displayName: true, avatarUrl: true } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        city: true,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const hash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: hash } });
    return { success: true };
  }

  async getNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, readAt: null } }),
    ]);
    return { items, meta: { total, page, limit, unreadCount } };
  }

  async markNotificationsRead(userId: string, ids?: string[]) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null, ...(ids ? { id: { in: ids } } : {}) },
      data: { readAt: new Date() },
    });
    return { success: true };
  }
}
