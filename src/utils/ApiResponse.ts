export class ApiResponse<T = unknown> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public data: T;
  public meta?: Record<string, unknown>;

  constructor(statusCode: number, data: T, message = 'Success', meta?: Record<string, unknown>) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static ok<T>(data: T, message = 'Success', meta?: Record<string, unknown>) {
    return new ApiResponse(200, data, message, meta);
  }

  static created<T>(data: T, message = 'Created successfully') {
    return new ApiResponse(201, data, message);
  }

  static noContent(message = 'Deleted successfully') {
    return new ApiResponse(204, null, message);
  }
}
