import { Client } from 'discordx'
import { Category } from '@discordx/utilities'
import { ChannelType, CommandInteraction, GuildMember, PermissionFlagsBits, ThreadMember, User } from 'discord.js'

import { Discord, Slash } from '@decorators'
import { Guard } from '@guards'

@Discord()
@Category('Forum')
export default class CloseCommand {

	@Slash({
		name: 'close',
		description: 'closes the post!',
	})
	@Guard()
	async close(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
        await interaction.deferReply();
        
        const channel = interaction.channel;
        
        // making sure the channel type is matching forum type
        if(channel?.type !== ChannelType.PublicThread) return;
        
        const member = interaction.member as GuildMember;

        const isOP = member?.user.id === channel.ownerId;
        
        // checking if the user is the owner of the forum post
        if(!isOP && !member.permissions.has(PermissionFlagsBits.ManageThreads)){       
            return;
        }

        await channel.setLocked();
		
		interaction.followUp(`## :lock: The post has been closed and locked by ${member}.`);
	}
}