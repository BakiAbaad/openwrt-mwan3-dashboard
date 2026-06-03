import express from 'express';
import authRoutes from './backend/routes/auth.routes.js';

export default function authRoutesExport() {
  return authRoutes();
}
