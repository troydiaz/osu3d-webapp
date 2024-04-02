import { Client, Events, GatewayIntentBits, EmbedBuilder, TextChannel } from 'npm:discord.js@14.14.1';
import { corsHeaders } from '../cors.ts';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

await client.login(Deno.env.get('DISCORD_BOT_TOKEN')!);

Deno.serve(async (req) => {
  // Send a response to the OPTION request before you use the req object.
  if (req.method === 'OPTIONS')
    return new Response('OK', { headers: corsHeaders, status: 200 });
  
  const body = await req.json();
  return await announce(body);
});

const announce = (body: { [key: string]: string }): Promise<Response> => {
  return new Promise(resolve => {
    client.once(Events.ClientReady, async () => {
      const discordChannel = client.channels.cache.get(Deno.env.get('DISCORD_MACHINE_EVENT_CHANNEL')!) as TextChannel;

      const embed = new EmbedBuilder()
      .setColor(0xFF5555)
      .setTitle(`New Issue Reported for ${body.machine_name}`)
      .addFields(
          { name: 'Location', value: `Tier ${body.tier}` },
          { name: 'Printer Type', value: `${body.make} ${body.model}` },
          { name: 'Issuer', value: body.member_name ?? 'no account name' },
          { name: 'Provided Description', value: body.description ?? '' }
      )
      .setTimestamp();

      await discordChannel.send({ embeds: [embed] });

      resolve(new Response('OK', { status: 200 }));
    });
  });
}