from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.middleware.cors import CORSMiddleware
from .routes import tasks
from .auth import router as auth_router
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi
from .src.api.chat_router import router as chat_router

# Initialize security scheme for JWT documentation
security = HTTPBearer()

app = FastAPI(
    title="Todo API",
    description="Secure & Production-Ready Backend for Phase II Todo Web App",
    version="1.0.0",
    # Add security scheme to OpenAPI
    security=[{"bearerAuth": []}]
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add the security scheme to the app's components
app.openapi_schema = None

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Todo API",
        version="1.0.0",
        description="Secure & Production-Ready Backend for Phase II Todo Web App",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Include the auth routes
app.include_router(auth_router, prefix="/api", tags=["auth"])

# Include the task routes
app.include_router(tasks.router, prefix="/api/{user_id}", tags=["tasks"])

# Include the chat routes
app.include_router(chat_router, tags=["chat"])

@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Custom handler for HTTP exceptions
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for request validation errors
    """
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": [
                {
                    "loc": error["loc"],
                    "msg": error["msg"],
                    "type": error["type"]
                }
                for error in exc.errors()
            ]
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    General exception handler for unexpected errors
    """
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

@app.get("/")
def read_root():
    return {"message": "Todo API - Secure & Production-Ready Backend"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}