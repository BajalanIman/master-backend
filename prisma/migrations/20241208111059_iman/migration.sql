-- CreateTable
CREATE TABLE "District" (
    "district_id" SERIAL NOT NULL,
    "district_name" VARCHAR(120) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("district_id")
);

-- CreateTable
CREATE TABLE "City" (
    "city_id" SERIAL NOT NULL,
    "city_name" VARCHAR(120) NOT NULL,
    "district_id" INTEGER NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("city_id")
);

-- CreateTable
CREATE TABLE "Station" (
    "station_id" SERIAL NOT NULL,
    "station_name" VARCHAR(64) NOT NULL,
    "longitude" DECIMAL(12,8) NOT NULL,
    "latitude" DECIMAL(12,8) NOT NULL,
    "panorama" TEXT,
    "information" TEXT,
    "city_id" INTEGER NOT NULL,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("station_id")
);

-- CreateTable
CREATE TABLE "SoilAttribute" (
    "soil_attribute_id" SERIAL NOT NULL,
    "soil_attribute_name" VARCHAR(64) NOT NULL,
    "soil_attribute_description" VARCHAR(150) NOT NULL,
    "soil_attribute_unit" VARCHAR(64) NOT NULL,

    CONSTRAINT "SoilAttribute_pkey" PRIMARY KEY ("soil_attribute_id")
);

-- CreateTable
CREATE TABLE "SoilMeasurement" (
    "soil_measurement_id" SERIAL NOT NULL,
    "station_id" INTEGER NOT NULL,
    "soil_attribute_id" INTEGER NOT NULL,
    "date_time" TIMESTAMP NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SoilMeasurement_pkey" PRIMARY KEY ("soil_measurement_id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "photos_id" SERIAL NOT NULL,
    "station_id" INTEGER NOT NULL,
    "photo" VARCHAR(600) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("photos_id")
);

-- CreateTable
CREATE TABLE "Device" (
    "device_id" SERIAL NOT NULL,
    "station_id" INTEGER NOT NULL,
    "device_name" VARCHAR(64) NOT NULL,
    "device_company" VARCHAR(64) NOT NULL,
    "installation_date" TIMESTAMP NOT NULL,
    "device_info" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "ClimateMeasurement" (
    "climate_measurement_id" SERIAL NOT NULL,
    "station_id" INTEGER NOT NULL,
    "climate_attribute_id" INTEGER NOT NULL,
    "date_time" TIMESTAMP NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ClimateMeasurement_pkey" PRIMARY KEY ("climate_measurement_id")
);

-- CreateTable
CREATE TABLE "ClimateAttribute" (
    "climate_attribute_id" SERIAL NOT NULL,
    "climate_attribute_name" VARCHAR(64) NOT NULL,
    "climate_attribute_description" VARCHAR(150) NOT NULL,
    "climate_attribute_unit" VARCHAR(64) NOT NULL,

    CONSTRAINT "ClimateAttribute_pkey" PRIMARY KEY ("climate_attribute_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "role" VARCHAR(10),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "District"("district_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "City"("city_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilMeasurement" ADD CONSTRAINT "SoilMeasurement_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "Station"("station_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoilMeasurement" ADD CONSTRAINT "SoilMeasurement_soil_attribute_id_fkey" FOREIGN KEY ("soil_attribute_id") REFERENCES "SoilAttribute"("soil_attribute_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "Station"("station_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "Station"("station_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClimateMeasurement" ADD CONSTRAINT "ClimateMeasurement_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "Station"("station_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClimateMeasurement" ADD CONSTRAINT "ClimateMeasurement_climate_attribute_id_fkey" FOREIGN KEY ("climate_attribute_id") REFERENCES "ClimateAttribute"("climate_attribute_id") ON DELETE RESTRICT ON UPDATE CASCADE;
