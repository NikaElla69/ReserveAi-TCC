-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `tenantId` CHAR(36) NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `telefone` VARCHAR(20) NULL,
    `senha_hash` VARCHAR(255) NOT NULL,
    `papel` ENUM('CUSTOMER', 'OWNER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `email_verificado` BOOLEAN NOT NULL DEFAULT false,
    `ultimo_login` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_cpf_key`(`cpf`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurants` (
    `id` CHAR(36) NOT NULL,
    `tenantId` CHAR(36) NOT NULL,
    `proprietario_id` CHAR(36) NOT NULL,
    `nome` VARCHAR(160) NOT NULL,
    `descricao` TEXT NULL,
    `telefone` VARCHAR(20) NULL,
    `email` VARCHAR(150) NULL,
    `endereco` VARCHAR(255) NOT NULL,
    `cidade` VARCHAR(100) NOT NULL,
    `estado` VARCHAR(2) NOT NULL,
    `cep` VARCHAR(9) NULL,
    `logo` VARCHAR(255) NULL,
    `banner_principal` VARCHAR(255) NULL,
    `capacidade` INTEGER NOT NULL,
    `horario_funcionamento` JSON NOT NULL,
    `politica_reservas` TEXT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `slug` VARCHAR(120) NOT NULL,
    `dominio_personalizado` VARCHAR(190) NULL,
    `avaliacao_media` DECIMAL(3, 2) NULL DEFAULT 0,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `restaurants_slug_key`(`slug`),
    INDEX `restaurants_tenantId_idx`(`tenantId`),
    INDEX `restaurants_proprietario_id_idx`(`proprietario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tables` (
    `id` CHAR(36) NOT NULL,
    `restaurante_id` CHAR(36) NOT NULL,
    `numero` VARCHAR(10) NOT NULL,
    `capacidade` INTEGER NOT NULL,
    `status` ENUM('DISPONIVEL', 'OCUPADA', 'MANUTENCAO', 'INATIVA') NOT NULL DEFAULT 'DISPONIVEL',
    `localizacao` VARCHAR(100) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `tables_restaurante_id_idx`(`restaurante_id`),
    UNIQUE INDEX `tables_restaurante_id_numero_key`(`restaurante_id`, `numero`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `id` CHAR(36) NOT NULL,
    `usuario_id` CHAR(36) NOT NULL,
    `restaurante_id` CHAR(36) NOT NULL,
    `mesa_id` CHAR(36) NOT NULL,
    `data_reserva` DATE NOT NULL,
    `horario_reserva` TIME(0) NOT NULL,
    `quantidade_pessoas` INTEGER NOT NULL,
    `status` ENUM('PENDENTE', 'CONFIRMADA', 'CANCELADA', 'REJEITADA', 'CONCLUIDA', 'NO_SHOW') NOT NULL DEFAULT 'PENDENTE',
    `justificativa` TEXT NULL,
    `observacoes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `reservations_usuario_id_idx`(`usuario_id`),
    INDEX `reservations_restaurante_id_idx`(`restaurante_id`),
    INDEX `reservations_mesa_id_idx`(`mesa_id`),
    INDEX `reservations_data_reserva_horario_reserva_idx`(`data_reserva`, `horario_reserva`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant_settings` (
    `id` CHAR(36) NOT NULL,
    `restaurant_id` CHAR(36) NOT NULL,
    `primary_color` VARCHAR(7) NOT NULL,
    `secondary_color` VARCHAR(7) NOT NULL,
    `banner_image` VARCHAR(255) NULL,
    `custom_slug` VARCHAR(120) NOT NULL,
    `instagram` VARCHAR(120) NULL,
    `facebook` VARCHAR(120) NULL,
    `whatsapp` VARCHAR(30) NULL,
    `website` VARCHAR(190) NULL,
    `descricao_curta` VARCHAR(255) NULL,
    `seo_title` VARCHAR(160) NULL,
    `seo_description` VARCHAR(255) NULL,
    `og_image` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `restaurant_settings_restaurant_id_key`(`restaurant_id`),
    UNIQUE INDEX `restaurant_settings_custom_slug_key`(`custom_slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant_images` (
    `id` CHAR(36) NOT NULL,
    `restaurant_id` CHAR(36) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `title` VARCHAR(150) NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `alt_text` VARCHAR(180) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `restaurant_images_restaurant_id_display_order_idx`(`restaurant_id`, `display_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `id` CHAR(36) NOT NULL,
    `usuario_id` CHAR(36) NOT NULL,
    `restaurante_id` CHAR(36) NOT NULL,
    `reserva_id` CHAR(36) NOT NULL,
    `nota` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `status` ENUM('PUBLICADA', 'OCULTA') NOT NULL DEFAULT 'PUBLICADA',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `reviews_reserva_id_key`(`reserva_id`),
    INDEX `reviews_usuario_id_idx`(`usuario_id`),
    INDEX `reviews_restaurante_id_idx`(`restaurante_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` CHAR(36) NOT NULL,
    `usuario_id` CHAR(36) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `revoked_at` DATETIME(3) NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `refresh_tokens_token_key`(`token`),
    INDEX `refresh_tokens_usuario_id_idx`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` CHAR(36) NOT NULL,
    `usuario_id` CHAR(36) NOT NULL,
    `acao` VARCHAR(100) NOT NULL,
    `tipo_entidade` VARCHAR(100) NOT NULL,
    `id_entidade` CHAR(36) NOT NULL,
    `mudancas` JSON NULL,
    `endereco_ip` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_usuario_id_idx`(`usuario_id`),
    INDEX `audit_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenants` (
    `id` CHAR(36) NOT NULL,
    `nome` VARCHAR(150) NOT NULL,
    `subdominio` VARCHAR(100) NOT NULL,
    `plano` VARCHAR(50) NOT NULL DEFAULT 'free',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenants_nome_key`(`nome`),
    UNIQUE INDEX `tenants_subdominio_key`(`subdominio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenant_settings` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `chave` VARCHAR(100) NOT NULL,
    `valor` TEXT NOT NULL,
    `tipo` VARCHAR(50) NOT NULL DEFAULT 'string',
    `descricao` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenant_settings_tenant_id_chave_key`(`tenant_id`, `chave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenant_features` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `nome_feature` VARCHAR(100) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `limite_uso` INTEGER NULL,
    `uso_atual` INTEGER NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tenant_features_tenant_id_nome_feature_key`(`tenant_id`, `nome_feature`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenant_api_keys` (
    `id` CHAR(36) NOT NULL,
    `tenant_id` CHAR(36) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `chave_api` VARCHAR(255) NOT NULL,
    `permissoes` JSON NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `expires_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tenant_api_keys_chave_api_key`(`chave_api`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurants` ADD CONSTRAINT `restaurants_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurants` ADD CONSTRAINT `restaurants_proprietario_id_fkey` FOREIGN KEY (`proprietario_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tables` ADD CONSTRAINT `tables_restaurante_id_fkey` FOREIGN KEY (`restaurante_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_restaurante_id_fkey` FOREIGN KEY (`restaurante_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_mesa_id_fkey` FOREIGN KEY (`mesa_id`) REFERENCES `tables`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurant_settings` ADD CONSTRAINT `restaurant_settings_restaurant_id_fkey` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `restaurant_images` ADD CONSTRAINT `restaurant_images_restaurant_id_fkey` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_restaurante_id_fkey` FOREIGN KEY (`restaurante_id`) REFERENCES `restaurants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_reserva_id_fkey` FOREIGN KEY (`reserva_id`) REFERENCES `reservations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenant_settings` ADD CONSTRAINT `tenant_settings_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenant_features` ADD CONSTRAINT `tenant_features_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenant_api_keys` ADD CONSTRAINT `tenant_api_keys_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

