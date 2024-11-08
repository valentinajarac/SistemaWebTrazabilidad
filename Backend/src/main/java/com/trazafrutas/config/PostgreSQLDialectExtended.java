package com.trazafrutas.config;

import org.hibernate.dialect.PostgreSQLDialect;
import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.query.sqm.function.SqmFunctionDescriptor;
import org.hibernate.type.StandardBasicTypes;
import org.hibernate.type.spi.TypeConfiguration;

public class PostgreSQLDialectExtended extends PostgreSQLDialect {

    @Override
    public void initializeFunctionRegistry(FunctionContributions functionContributions) {
        super.initializeFunctionRegistry(functionContributions);

        TypeConfiguration typeConfiguration = functionContributions.getTypeConfiguration();

        // Registrar función date_trunc
        functionContributions.getFunctionRegistry().registerPattern(
                "date_trunc",
                "date_trunc(?1, ?2)",
                typeConfiguration.getBasicTypeRegistry().resolve(StandardBasicTypes.TIMESTAMP)
        );

        // Registrar función para intervalos
        functionContributions.getFunctionRegistry().registerPattern(
                "subtract_months",
                "?1 - interval '?2 month'",
                typeConfiguration.getBasicTypeRegistry().resolve(StandardBasicTypes.TIMESTAMP)
        );

        // Registrar funciones de extracción de fecha
        functionContributions.getFunctionRegistry().registerPattern(
                "year",
                "extract(year from ?1)",
                typeConfiguration.getBasicTypeRegistry().resolve(StandardBasicTypes.INTEGER)
        );

        functionContributions.getFunctionRegistry().registerPattern(
                "month",
                "extract(month from ?1)",
                typeConfiguration.getBasicTypeRegistry().resolve(StandardBasicTypes.INTEGER)
        );

        // Registrar función para el primer día del mes
        functionContributions.getFunctionRegistry().registerPattern(
                "first_day_of_month",
                "date_trunc('month', ?1)",
                typeConfiguration.getBasicTypeRegistry().resolve(StandardBasicTypes.TIMESTAMP)
        );

        // Registrar función para el último día del mes
        functionContributions.getFunctionRegistry().registerPattern(
                "last_day_of_month",
                "(date_trunc('month', ?1) + interval '1 month' - interval '1 day')",
                typeConfiguration.getBasicTypeRegistry().resolve(StandardBasicTypes.TIMESTAMP)
        );
    }
}
