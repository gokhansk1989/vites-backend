import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto, ConfirmCashPaymentDto, ConfirmHandoffDto } from './dto/orders.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.id, dto);
  }

  @Get('mine')
  getMine(@Request() req, @Query('role') role: 'buyer' | 'seller' = 'buyer') {
    return this.ordersService.getMyOrders(req.user.id, role);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.getOrder(id, req.user.id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.ordersService.cancelOrder(id, req.user.id);
  }

  // ── Elden ödeme akışı ──

  /** Alıcı: "Elden ödeyeceğim" → CREATED → PAID_ESCROW */
  @Post(':id/cash-payment')
  confirmCashPayment(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: ConfirmCashPaymentDto,
  ) {
    return this.ordersService.confirmCashPayment(id, req.user.id, dto);
  }

  /** Satıcı: "Teslim ettim" → PAID_ESCROW → DELIVERED */
  @Post(':id/handoff')
  confirmHandoff(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: ConfirmHandoffDto,
  ) {
    return this.ordersService.confirmHandoff(id, req.user.id, dto);
  }

  /** Alıcı: "Teslim aldım" → DELIVERED → COMPLETED */
  @Post(':id/receipt')
  confirmReceipt(@Param('id') id: string, @Request() req) {
    return this.ordersService.confirmReceipt(id, req.user.id);
  }
}
