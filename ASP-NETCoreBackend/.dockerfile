# ================================
# Stage 1: Build
# ================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY RazorBackend.csproj ./
RUN dotnet restore

# Copy all source code and publish
COPY . ./
RUN dotnet publish -c Release -o /app

# ================================
# Stage 2: Runtime
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app ./

# ส่ง traffic มาที่ PORT environment variable
EXPOSE 8080

ENTRYPOINT ["dotnet", "RazorBackend.dll"]
