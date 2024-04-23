import express from "express";

const app = express();
const port = 3001;

// Allow express to parse JSON bodies
app.use(express.json());

//
app.post("/api/token", async (req: any, res: any) => {
  const client_id = Deno.env.get("VITE_DISCORD_CLIENT_ID");
  const client_secret = Deno.env.get("DISCORD_CLIENT_SECRET");
  if(!client_id || !client_secret) {
    throw new Error("Missing environment variables");
  }

  // Exchange the code for an access_token
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: client_id,
      client_secret: client_secret,
      grant_type: "authorization_code",
      code: req.body!.code ? req.body!.code : "",
    }),
  });

  // Retrieve the access_token from the response
  const { access_token } = await response.json();

  // Return the access_token to our client as { access_token: "..."}
  res.send({access_token});
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
