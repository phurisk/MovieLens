# ================================
# Stage 1: Build
# ================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY RazorBackend.csproj ./
RUN dotnet restore

# Copy all source code and publish
COPY . ./
RUN dotnet publish -c Release -o /out

# ================================
# Stage 2: Runtime
# ================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published app
COPY --from=build /out ./

# Copy Data folder เข้า container
COPY Data /app/Data

EXPOSE 8080

ENTRYPOINT ["dotnet", "RazorBackend.dll"]
