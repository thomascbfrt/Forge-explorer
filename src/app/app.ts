import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, Toast, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
