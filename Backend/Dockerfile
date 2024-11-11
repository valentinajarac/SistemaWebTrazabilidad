FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /workspace/app

# Instalar herramientas necesarias
RUN apk add --no-cache curl tar dos2unix maven

# Copiar el código fuente y recursos
COPY . .

# Convertir los archivos de texto a formato Unix
RUN dos2unix mvnw && \
    chmod +x mvnw

# Construir el proyecto
RUN mvn clean package -DskipTests

# Etapa final
FROM eclipse-temurin:17-jre-alpine

# Crear directorio para la aplicación
WORKDIR /app

# Copiar el JAR desde la etapa de construcción
COPY --from=build /workspace/app/target/*.jar app.jar

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "/app/app.jar"]