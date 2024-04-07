export const errorMiddleware = (err, req, res, next) => {
    let statusCode = res.statusCode || 500;
    let message = err.message || "Internal Server Error!";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
}