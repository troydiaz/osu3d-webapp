import { Client, Events, GatewayIntentBits } from 'npm:discord.js@14.14.1';
import { corsHeaders } from '../cors.ts';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

await client.login(Deno.env.get('DISCORD_BOT_TOKEN')!);

Deno.serve(async (req) => {
  // Send a response to the OPTION request before you use the req object.
  if (req.method === 'OPTIONS') return new Response('OK', { headers: corsHeaders, status: 200 });

  const { username, message } = await req.json();
  return await sendMessage(username, message);
});

const sendMessage = (username: string, message: string): Promise<Response> => {
  return new Promise((resolve) => {
    client.once(Events.ClientReady, async () => {
      const discordGuild = client.guilds.cache.get(Deno.env.get('DISCORD_SERVER')!);
      const allMembers = await discordGuild!.members.fetch();
      const user = allMembers.find((m) => m.user.username === username);

      // If member exists, send a message to them
      await user?.send(message);

      resolve(new Response('OK', { status: 200 }));
    });
  });
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/discord-ping' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"username":"DISCORD_USERNAME_HERE"}'

*/
