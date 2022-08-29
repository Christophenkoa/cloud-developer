import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Request, Response } from "express";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filters user's image endpoint.
  app.get("/filteredimage", async ( req: Request, res: Response ) => {

    let image_url: string = req.query.image_url.toString();

    // Returns 400 response if the image url is not provided.
    if (!image_url) {
      return res.status(400)
          .send(`image url is required`);
    }
    const filtered_image = await filterImageFromURL(image_url);

    // Returns 200 with the filtered image and cleans the memory.
    return res.status(200)
        .sendFile(filtered_image, () => deleteLocalFiles([filtered_image]));
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();