import { Client } from 'discordx'
import { Category } from '@discordx/utilities'
import { ChannelType, CommandInteraction, GuildMember, PermissionFlagsBits } from 'discord.js'

import { Discord, Slash } from '@decorators'
import { Guard } from '@guards'
import { replyToInteraction } from '@utils/functions'

@Discord()
@Category('Forum')
export default class SolvedCommand {

	@Slash({
		name: 'solved',
		description: 'closes the post!'
	})
	@Guard()
	async solved(
		interaction: CommandInteraction,
		client: Client,
		{ localize }: InteractionData
	) {
		
		const channel = interaction.channel;
        
        // making sure the channel type is matching forum type
        if(channel?.type !== ChannelType.PublicThread) return;
        
        const member = interaction.member as GuildMember;

        const isOP = member?.user.id === channel.ownerId;
        
        // checking if the user is the owner of the forum post
        if(!isOP){
            await interaction.reply({
                content: `Only the OP is allowed to mark the post as solved!`,
                ephemeral: true,
            });
            
            return;
        }

        await channel.setLocked();
		
		await interaction.reply(`
            :white_check_mark: **Problem Solved**
            
            ${member} has marked this post as solved. 
            Thanks to everyone who participated in resolving the issue.
            
            :lock: The post has now been closed & locked.
        `.replace(/^ +/gm, ''));
	}
}