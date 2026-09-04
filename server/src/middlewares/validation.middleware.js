import ErrorHandler from "../utils/errorHandler.js";

export const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body || {});

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");

            const error = new ErrorHandler(message, 400);

            error.fieldErrors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            return next(error);
        }

        next();
    };
};
