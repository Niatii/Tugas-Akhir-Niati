import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { Handler } from "./cores/exceptions/handler.exception";
import { Response } from "./cores/interceptions/response.interception";
import express = require("express");
import * as path from "path";
import * as fs from "fs";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set("query parser", "extended");
  const httpAdapter = app.get(HttpAdapterHost);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalFilters(new Handler(httpAdapter));
  app.useGlobalInterceptors(new Response());
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
  });

  // Serve uploaded files (templates, certificates, QR codes)
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads',
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  });

  await app.listen(3000);
}
bootstrap();
