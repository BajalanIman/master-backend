import express from "express";
import cors from "cors";
import compression from "compression"; //for optimizations
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 8900;
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "https://master-frontend-31-12-2024.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(compression()); //for optimization
app.use(express.static("public"));
app.use(express.json({ limit: "100mb" }));

//  City ---------------------------------------------------------------------------
app.get("/city", async (req, res) => {
  try {
    const cities = await prisma.city.findMany();
    return res.json(cities);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

// Station -------------------------------------------------------------------------
app.get("/station", async (req, res) => {
  try {
    const stations = await prisma.station.findMany();
    return res.json(stations);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});
app.get("/soil_measurements", async (req, res) => {
  try {
    const soil_measurements = await prisma.soilMeasurement.findMany({
      include: {
        station: true,
        soil_attribute: true,
      },
    });
    return res.json(soil_measurements);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

// Soil Measurements
app.post("/bulk_soil_measurements", async (req, res) => {
  console.log("Received data:", req.body); // Log incoming data for debugging

  const records = req.body.map((record) => {
    // Ensure value is a valid float (number)
    let validValue = parseFloat(record.value);
    if (isNaN(validValue)) {
      console.log(
        `Invalid value for station ${record.station_id} and soil attribute ${record.soil_attribute_id}: ${record.value}`
      );
      validValue = null; // Set to null or handle it accordingly if invalid
    }

    // Ensure date_time is in ISO-8601 format
    let formattedDate = record.date_time
      ? new Date(record.date_time).toISOString() // Converts to ISO-8601 format (e.g., 2024-04-07T09:00:00.000Z)
      : undefined; // If date_time is not provided, set it to undefined (let PostgreSQL handle it)

    // Return the processed record
    return {
      station_id: record.station_id,
      soil_attribute_id: record.soil_attribute_id,
      date_time: formattedDate, // Ensure correct format or undefined
      value: validValue, // Ensure value is a valid float or null
    };
  });

  try {
    await prisma.soilMeasurement.createMany({
      data: records,
      skipDuplicates: true,
    });
    res.send("Soil data inserted/updated successfully");
  } catch (err) {
    console.error("Error inserting soil data:", err);
    res.status(500).send("Server error");
  }
});

// Climate Measurements
app.get("/climate_measurements", async (req, res) => {
  try {
    const climate_measurements = await prisma.climateMeasurement.findMany({
      include: {
        station: true,
        climate_attribute: true,
      },
    });
    return res.json(climate_measurements);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

// Bulk Insert for Soil Measurements
app.post("/bulk_soil_measurements", async (req, res) => {
  console.log("Received data:", req.body); // Log incoming data for debugging

  const records = req.body.map((record) => {
    // Ensure value is parsed as a float (number)
    let validValue = parseFloat(record.value);

    // If value is not a valid number, log the invalid value and set it to null or handle it
    if (isNaN(validValue)) {
      console.log(
        `Invalid value for station ${record.station_id} and soil attribute ${record.soil_attribute_id}: ${record.value}`
      );
      validValue = null; // You can choose to set it to null or handle it accordingly
    }

    // Ensure date_time is in ISO-8601 format
    let formattedDate = record.date_time
      ? new Date(record.date_time).toISOString() // Converts to ISO-8601 format
      : undefined; // If date_time is missing, set it to undefined

    // Ensure the value is being passed
    if (validValue === undefined) {
      console.log(
        `Value missing for station ${record.station_id}, soil attribute ${record.soil_attribute_id}`
      );
    }

    // If the value is valid, return the processed record
    return {
      station_id: record.station_id,
      soil_attribute_id: record.soil_attribute_id,
      date_time: formattedDate, // Ensure correct format or undefined
      value: validValue, // Ensure value is a valid float or null
    };
  });

  // After processing, ensure the data is in the correct format
  console.log("Processed records:", records);

  try {
    // Insert the records into the database
    await prisma.soilMeasurement.createMany({
      data: records,
      skipDuplicates: true,
    });
    res.send("Soil data inserted/updated successfully");
  } catch (err) {
    console.error("Error inserting soil data:", err);
    res.status(500).send("Server error");
  }
});

// Bulk Insert for Climate Measurements
app.post("/bulk_climate_measurements", async (req, res) => {
  const records = req.body.map((record) => {
    // Ensure value is a valid float
    let validValue = parseFloat(record.value);

    // Check if value is NaN (invalid)
    if (isNaN(validValue)) {
      validValue = null; // Set to null or handle it accordingly
    }

    // Ensure date_time is in ISO-8601 format
    let formattedDate = record.date_time
      ? new Date(record.date_time).toISOString() // Converts to ISO-8601 format (e.g., 2024-04-07T09:00:00.000Z)
      : undefined; // If date_time is not provided, set it to undefined (let PostgreSQL handle it)

    return {
      station_id: record.station_id,
      climate_attribute_id: record.climate_attribute_id,
      date_time: formattedDate, // Ensure correct format or undefined
      value: validValue, // Pass as a float
    };
  });

  try {
    await prisma.climateMeasurement.createMany({
      data: records,
      skipDuplicates: true,
    });
    res.send("Climate data inserted/updated successfully");
  } catch (err) {
    console.error("Error inserting climate data:", err);
    res.status(500).send("Server error");
  }
});

// Users --------------------------------------------------------------------------
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
});

app.post("/users", async (req, res) => {
  const { password, first_name, last_name, phone_number, email, role } =
    req.body;
  try {
    await prisma.user.create({
      data: {
        password,
        first_name,
        last_name,
        phone_number,
        email,
        role,
      },
    });
    return res.status(201).json({ message: "Record inserted successfully" });
  } catch (err) {
    console.error("Error inserting record:", err);
    return res.status(500).json({ error: "Error inserting record" });
  }
});
// Photos ---------------------------------------------------------------------
app.get("/photos", async (req, res) => {
  try {
    const photos = await prisma.photo.findMany();
    return res.json(photos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error fetching photos" });
  }
});

app
  .listen(8800, () => {
    console.log("Server running on port 8900");
  })
  .on("error", (err) => {
    console.error("Error starting server:", err);
  });
