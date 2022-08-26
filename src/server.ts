import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import { Application, Request, Response, NextFunction, Errback , Express} from "express";

(async () => {
  // Init the Express application
  const app: Express = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.

  app.get(
    "/filteredimage",
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.query.image_url) {
        return res.status(400).send({ message: "Image url is required" });
      }

      try {
        const filteredpath = await filterImageFromURL(req.query.image_url as string);
        res
          .status(200)
          .sendFile(filteredpath, () => deleteLocalFiles([filteredpath]));
      } catch (err) {
        res.status(422).send({ message: "Unable to process the image" });
      } finally {
        next();
      }
    }
  );

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
