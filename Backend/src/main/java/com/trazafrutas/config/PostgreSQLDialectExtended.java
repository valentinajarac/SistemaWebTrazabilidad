package com.trazafrutas.config;

import org.hibernate.dialect.PostgreSQLDialect;
import org.hibernate.boot.model.FunctionContributions;
import org.hibernate.type.BasicTypeRegistry;
import org.hibernate.type.StandardBasicTypes;

public class PostgreSQLDialectExtended extends PostgreSQLDialect {

    @Override
    public void initializeFunctionRegistry(FunctionContributions functionContributions) {
        super.initializeFunctionRegistry(functionContributions);

        // Registrar función date_trunc
        functionContributions.getFunctionRegistry().registerPattern(
                "date_trunc",
                "date_trunc(?1, ?2)",
                functionContributions.getTypeConfiguration().getBasicTypeRegistry().resolve(StandardBasicTypes.TIMESTAMP)
        );

        // Registrar función para intervalos
        functionContributions.getFunctionRegistry().registerPattern(
                "subtract_months",
                "?1 - ?2 * interval '1 month'",
                functionContributions.getTypeConfiguration().getBasicTypeRegistry().resolve(StandardBasicTypes.TIMESTAMP)
        );

        // Registrar funciones de extracción de fecha
        functionContributions.getFunctionRegistry().registerPattern(
                "year",
                "extract(year from ?1)",
                functionContributions.getTypeConfiguration().getBasicTypeRegistry().resolve(StandardBasicTypes.INTEGER)
        );

        functionContributions.getFunctionRegistry().registerPattern(
                "month",
                "extract(month from ?1)",
                functionContributions.getTypeConfiguration().getBasicTypeRegistry().resolve(StandardBasicTypes.INTEGER)
        );
    }
}