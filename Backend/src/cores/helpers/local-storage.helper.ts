import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalStorageHelper {
  private readonly baseUploadDir: string;

  constructor() {
    this.baseUploadDir = path.join(process.cwd(), 'uploads');
    this.ensureBaseDir();
  }

  private ensureBaseDir() {
    if (!fs.existsSync(this.baseUploadDir)) {
      fs.mkdirSync(this.baseUploadDir, { recursive: true });
    }
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Save a buffer to disk
   * @param buffer  File content
   * @param subDir  Sub-directory inside uploads/ (e.g. "certificates", "templates")
   * @param filename  Filename with extension
   * @returns relative file path (from uploads/) e.g. "certificates/abc.pdf"
   */
  async saveFile(
    buffer: Buffer,
    subDir: string,
    filename: string,
  ): Promise<{ filePath: string; fileUrl: string }> {
    const dir = path.join(this.baseUploadDir, subDir);
    this.ensureDir(dir);

    const fullPath = path.join(dir, filename);
    fs.writeFileSync(fullPath, buffer);

    const filePath = `${subDir}/${filename}`;
    const fileUrl = `/uploads/${filePath}`;

    return { filePath, fileUrl };
  }

  /**
   * Save an Express multer file to disk
   */
  async saveMulterFile(
    file: Express.Multer.File,
    subDir: string,
    customFilename?: string,
  ): Promise<{ filePath: string; fileUrl: string }> {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename =
      customFilename ?? `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    return this.saveFile(Buffer.from(file.buffer), subDir, filename);
  }

  /**
   * Delete a file by relative path (from uploads/)
   */
  deleteFile(filePath: string): void {
    try {
      const fullPath = path.join(this.baseUploadDir, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (e) {
      // Non-critical — log only
      console.warn(`[LocalStorage] Could not delete file: ${filePath}`, e?.message);
    }
  }

  /**
   * Read file as Buffer
   */
  readFile(filePath: string): Buffer {
    const fullPath = path.join(this.baseUploadDir, filePath);
    return fs.readFileSync(fullPath);
  }

  /**
   * Get absolute path for a relative file path
   */
  getAbsolutePath(filePath: string): string {
    return path.join(this.baseUploadDir, filePath);
  }

  /**
   * Get public URL for a file path
   */
  getPublicUrl(filePath: string): string {
    return `/uploads/${filePath}`;
  }
}
