FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /app

# Configurar codificación por defecto
ENV LANG=es_ES.UTF-8
ENV LANGUAGE=es_ES:es
ENV LC_ALL=es_ES.UTF-8
ENV MAVEN_OPTS="-Dfile.encoding=UTF-8"

# Copiar el pom.xml primero para aprovechar la caché de dependencias
COPY pom.xml .

# Descargar dependencias
RUN mvn dependency:go-offline -B

# Copiar el código fuente
COPY src ./src/

# Construir la aplicación
RUN mvn clean package -DskipTests \
    -Dproject.build.sourceEncoding=UTF-8 \
    -Dproject.reporting.outputEncoding=UTF-8 \
    -Dfile.encoding=UTF-8

# Etapa de producción
FROM eclipse-temurin:17-jre-alpine

# Configurar codificación por defecto
ENV LANG=es_ES.UTF-8
ENV LANGUAGE=es_ES:es
ENV LC_ALL=es_ES.UTF-8
ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"

WORKDIR /app

# Copiar el JAR construido
COPY --from=build /app/target/trazafrutas-backend-1.0.0.jar app.jar

# Exponer puerto
EXPOSE 8080

# Comando para ejecutar la aplicación
CMD ["java", "-Dfile.encoding=UTF-8", "-jar", "app.jar"]