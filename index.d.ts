import Eris from '@augu/eris';
import { Collection } from '@maika.xyz/eris-utils';
import Hideri from '@maika.xyz/hideri';

/** The heart and soul of Maika. */
declare namespace Kotori {
    /**
     * The version of the component: `@maika.xyz/kotori`
     */
    export const version: string;

    /**
     * Create a new instance of Kotori
     * 
     * The `create` function is here so you can use `Kotori.create()` to return the `Client` instance but you can still do `new KotoriClient()`.
     * @param options The additional options to create the client
     * @returns The client instance
     */
    export function create(options: Kotori.DefaultOptions): Kotori.Client;

    // #region Classes
    /** The argument parser */
    export class ArgumentParser {
        public arguments: string[];

        /**
         * Create a new instance of the argument parser
         * @param arguments The arguments to construct
         */
        constructor(arguments: string[]);
        
        /**
         * Gets the argument string
         * @param index The index number to get
         * @returns The argument string
         */
        public get(index: number): string;

        /**
         * Checks if the index of the argument is empty
         * @param index The index number to check
         * @returns A boolean if it is or not
         */
        public isEmpty(index: number): boolean;

        /**
         * Gathers the arguments
         * @param sep The seperator to seperate it (default: `' '`)
         * @returns The gathered arguments
         */
        public gather(sep?: string): string;

        /**
         * Removes the first element and returns the argument(s)
         * @returns The arguments but the first element removed
         */
        public shift(): string[];

        /**
         * Checks the length of `index` if anything is assoiated
         * with it
         * @param index The index
         * @returns a Boolean if it is or not
         */
        public has(index: number): boolean;
    }

    /** The client to initisate from */
    export class Client extends Eris.Client {
        public manager: CommandManager;
        public events: EventManager;
        public schedulers: SchedulerManager;
        public database: DatabaseManager;
        public emojis: { [x: string]: string; };
        public logger: Hideri.Logger;
        public prefix: string;
        public owners: string[];

        /**
         * Construct a new Client instance
         * @param options Addition options to add on to
         */
        constructor(options: Kotori.DefaultOptions);

        /**
         * Boots the bot up
         */
        public start(): Promise<void>;

        /**
         * Grabs a shard ID
         * @param i The shard ID
         * @returns The shard
         */
        public getShard(i: number): Eris.Shard;
    }

    /** The command interface */
    export class Command {
        public client: Kotori.Client;
        public command: string;
        public description: string | Kotori.DescriptionSupplier;
        public usage: string;
        public category: string;
        public aliases: string[];
        public hidden: boolean;
        public disabled: boolean;
        public ownerOnly: boolean;
        public guildOnly: boolean;
        public nsfw: boolean;
        public throttle: number;

        /**
         * Construct a new instance of the Command interface
         * @param client The client
         * @param options Additional options to add on
         */
        constructor(client: Kotori.Client, options: Kotori.CommandOptions);

        /**
         * Prettifies the command usage
         */
        public format(ctx: Kotori.CommandContext): string;

        /**
         * Unloads the command
         */
        public unload(): void;
    }

    /** The command context */
    export class CommandContext {
        public client: Kotori.Client;
        public message: Eris.Message;
        public args: Kotori.ArgumentParser;
        public collector: Kotori.MessageCollector;
        public guildSettings: Kotori.GuildSettings;
        public userSettings: Kotori.UserSettings;
        public guild: Eris.Guild;
        public channel: Eris.TextableChannel;
        public sender: Eris.User;

        /**
         * Create a new instance of the command context interface
         * @param client The client
         * @param message The message
         * @param args The array of arguments provided
         */
        constructor(client: Kotori.Client, message: Eris.Message, args: string[]);

        /**
         * Sends a message to the text channel
         * @param content The content to send
         * @returns The promised message that was sent
         */
        public send(content: string): Promise<Eris.Message>;

        /**
         * Sends an embed to the text channel
         * @param content The embed to send
         * @returns The promised message that was sent
         */
        public embed(content: Eris.Embed): Promise<Eris.Message>;

        /**
         * Translates the user's locale into a string
         * @param term The term to get
         * @param args Any additional contextial arguments to add
         * @returns The locale translated
         */
        public translate(term: string, ...args: any[]): Promise<string>;

        /**
         * Sends a codeblock to a Discord channel
         * @param lang The language
         * @param content The content to send
         * @returns The promised message
         */
        public code(lang: string, content: string): Promise<Eris.Message>;

        /**
         * Shoots a message to a Discord user's DM channel
         * @param content The content to send
         * @param options Contextial options to add on
         * @returns The promised message
         */
        public dm(content: string, options?: {
            user: Eris.User;
            embed?: Eris.Embed;
        }): Promise<Eris.Message>;
    }

    /** The command manager to manage "command" related stuff */
    export class CommandManager implements Manager {
        public client: Kotori.Client;
        public commands: Collection<Command>;
        public processor: CommandProcessor;
        public options: Kotori.ManagerOptions;

        /**
         * Construct a new instance of the Command manager
         * @param client The client
         * @param options The options
         */
        constructor(client: Kotori.Client, options: Kotori.ManagerOptions);
        public start(): void;
    }

    /** The command processor to process all commands */
    export class CommandProcessor implements Processor {
        public client: Kotori.Client;
        public ratelimits: Collection<Collection<number>>;

        /**
         * Construct a new command processor
         * @param client The client
         */
        constructor(client: Kotori.Client);
        public process(msg: Eris.Message): void;
    }

    /** The database manager */
    export class DatabaseManager {
        public client: Kotori.Client;
        public m: typeof import("mongoose");

        /**
         * Construct a new database manager interface
         * @param client The client
         * @param options The options to add on to
         */
        constructor(client: Kotori.Client, options: Kotori.DatabaseManagerOptions);

        /**
         * Starts the database
         */
        public connect(): Promise<void>;

        /**
         * Destroys the database
         * @param reason The reason (default: `Killed Process CTRL+Q`)
         * @returns The trace result
         */
        public destroy(reason?: string): Kotori.IDestroyResult;
    }

    /** The event interface */
    export class Event {
        public client: Kotori.Client;
        public event: Kotori.Emittable;

        /**
         * Construct a new event interface
         * @param client The client
         * @param event The event to run
         */
        constructor(client: Kotori.Client, event: Kotori.Emittable);

        /**
         * Runs the event
         * @param args Any arguments to run
         */
        public emit(...args: any[]): void;
    }

    /** The event manager to manage all "event" releated stuff */
    export class EventManager implements Manager {
        public client: Kotori.Client;

        /**
         * Construct a new event manager
         * @param client The client instance
         * @param options The options to add on to
         */
        constructor(client: Kotori.Client, options: Kotori.ManagerOptions);
        public start(): void;
    }

    /** The event processor to process all events */
    export class EventProcessor implements Processor {
        public client: Kotori.Client;

        /**
         * Construct a new event processor
         * @param client The client
         */
        constructor(client: Kotori.Client);
        public process(event: Kotori.Event): void;
    }

    /** Guild settings */
    export class GuildSettings implements SettingsBase<IGuildSettings> {
        public client: Kotori.Client;
        public schema: IGuildSettings;
        constructor(client: Kotori.Client);
        public get(id: string): IGuildSettings;
        public update(options: { id: string; doc: any; callback: (error: Error, data: IGuildSettings) => void; }): Promise<void>;
        public delete(id: string): Promise<void>;
    }

    /** The manager interface */
    export interface Manager {
        /** The client */
        client: Kotori.Client;

        /** The start function to process the manager's doings */
        start(): void;
    }

    /** The message collector for awaiting messages */
    export class MessageCollector {
        public collectors: {
            [x: string]: {
                filter: Kotori.MessageFilter;
                accept: (value?: Promise<Eris.Message> | PromiseLike<Eris.Message>) => void;
            } 
        };

        /**
         * Construct a new message collector instance
         * @param client The client instance
         */
        constructor(client: Kotori.Client);

        /**
         * Verifies an awaited message
         * @param msg The message
         */
        private verify(msg: Eris.Message): void;

        /**
         * Await an message
         * @param filter The filter
         * @param options Additional contextial options
         * @returns The promised message
         */
        public awaitMessage(filter: Kotori.MessageFilter, options: Kotori.MessageCollectorOptions): Promise<Eris.Message>;
    }

    /** Permission utils for Discord permissions */
    export class PermissionUtil {
        public prettified: { [x: string]: string; };

        /**
         * Resolves a permission bitfield
         * @param permission The permission bitfield
         * @returns The bitfield number
         */
        public static resolve(permission: Kotori.PermissionResolvable): number;

        /**
         * Utility to check permission bitfields for users
         * @param member The member
         * @param permission The permission
         * @returns If they have it or not
         */
        public static hasPermission(member: Eris.Member, permission: Kotori.Permission): boolean;

        /**
         * Prettified permission bitfield
         * @param permission The field
         * @returns The prettified permission 
         */
        public static humanize(permission: Kotori.Permission): string;
    }

    /** Processor interface */
    export interface Processor {
        /** The client instance */
        client: Kotori.Client;
        
        /** Process the proccessor's proces */
        process(...args: any[]): void;
    }

    /** The REST client to grab Discord objects */
    export class RESTClient {
        public client: Kotori.Client;

        /**
         * Construct a new instance of the REST client to grab Discord Objects
         * @param client The client instance
         */
        constructor(client: Kotori.Client);

        /**
         * Grabs a discord "role"
         * @param query The query
         * @param guild The guild
         * @returns The promised role
         */
        public getRole(query: string, guild: Eris.Guild): Promise<Eris.Role>;

        /**
         * Grabs a discord "user"
         * @param query The query
         * @returns The promised user
         */
        public getUser(query: string): Promise<Eris.User>;

        /**
         * Grabs a discord text/voice/category channel
         * @param query The query
         * @param guild The guild
         * @returns The promised channel
         */
        public getChannel(query: string, guild: Eris.Guild): Promise<Eris.TextChannel | Eris.VoiceChannel | Eris.CategoryChannel>;

        /**
         * Grabs a discord guild
         * @param query The query
         * @returns The promised guild
         */
        public getGuild(query: string): Promise<Eris.Guild>;

        /**
         * Gets a Discord message
         * @param channelID The channel ID
         * @param messageID The message ID
         * @returns The promised message
         */
        public getMessage(channelID: string, messageID: string): Promise<Eris.Message>;
    }

    /** Setting Base Interface */
    export interface SettingsBase<U> {
        client: Kotori.Client;
        schema: U;
        get(id: string): U;
        update(options: {
            id: string;
            doc: any;
            callback: (error: Error, data: U) => void;
        }): Promise<void>;
        delete(id: string): Promise<void>;
    }

    /** The scheduler interface */
    export class Scheduler {
        public client: Kotori.Client;
        public name: string;
        public interval: number;
        public disabled: boolean;

        /**
         * Construct a new scheduler interface
         * @param client The client
         * @param options Additional contextial options
         */
        constructor(client: Kotori.Client, options: Kotori.SchedulerOptions);
        public run(): void;
    }

    /** The scheduler manager to manage all "task" related stuff */
    export class SchedulerManager implements Manager {
        public client: Kotori.Client;
        public tasks: Collection<Kotori.Scheduler>;

        /**
         * Construct a new scheduler manager
         * @param client The client
         * @param options Additional contextial options
         */
        constructor(client: Kotori.Client, options: Kotori.ManagerOptions);
        public start(): void;
    }

    /** User settings */
    export class UserSettings implements SettingsBase<IUserSettings> {
        public client: Kotori.Client;
        public schema: IUserSettings;
        constructor(client: Kotori.Client);
        public get(id: string): IUserSettings;
        public update(options: { id: string; doc: any; callback: (error: Error, data: IUserSettings) => void; }): Promise<void>;
        public delete(id: string): Promise<void>;
    }

    /** Other utilities */
    export class Util {
        /**
         * Checks if `x` is a function
         * @param fn The function
         * @returns A boolean if it is or not
         */
        public static isFunction(x: Function): boolean;
    }
    // #endregion Classes

    // #region Types
    
    /** Type definition for type: `ILavalinkTrack` */
    export type ILavalinkTrack = {
        /** The unique identifier of the track, as defined by the provider (youtube, soundcloud, etc..) */
        identifier: string;

        /** Whether the use of the seek method is possible */
        isSeekable: boolean;

        /** The name of the author of the track */
        author: string;

        /** The duration of the track in milliseconds */
        length: number;

        /** Whether the track is a livestream or not */
        isStream: boolean;

        /** The current position of the player in the track, represented in milliseconds */
        position: number;

        /** The title of the track */
        title: string;

        /** The URL of the track */
        uri: string;
    };

    /** Type definition for type: `LavalinkTrack` */
    export type LavalinkTrack = {
        /** The base64 encoded track name */
        name: string;

        /** The track information */
        track: Kotori.ILavalinkTrack;
    }

    /** Type definition for type: `DefaultOptions` */
    export type DefaultOptions = {
        /** The discord bot token to authenicate to Discord */
        token: string;

        /** The command prefix */
        prefix: string;

        /** The path to all of the commands */
        commands: string;

        /** Path to all events */
        events: string;

        /** Path to all tasks (schedulers) */
        schedulers: string;

        /** Path to all locales */
        languages: string;

        /** Lavalink options */
        lavalink: LavalinkOptions;

        /** MongoDB authenication */
        dbURL: string;

        /** The owners of the bot */
        owners: string[];
    } & Eris.ClientOptions;

    /** Type definition for type: `LavalinkOptions` */
    export type LavalinkOptions = {
        /** The host to connect from (default: `127.0.0.1`) */
        host?: string;

        /** The port to connect from the host (default: `2333`) */
        port?: number;

        /** The password to authenicate from (default: `youshallnotpass`) */
        password?: string;
    }

    /** Type defintion for: `CommandOptions` */
    export type CommandOptions = {
        /** The command name */
        command: string;

        /** The command description */
        description: string | Kotori.DescriptionSupplier;

        /** The command usage (Use `<command>.getFormat()` to "prettify" the usage) */
        usage?: string;

        /** The command category (default: `Generic`) */
        category?: string;

        /** The command aliases (returns an empty array if no aliases were provided) */
        aliases?: string[];

        /** Whenever or not the command should be executed in a Discord guild */
        guildOnly?: boolean;

        /** Whenever or not the command should be executed by the owners */
        ownerOnly?: boolean;

        /** Whenever or not the command should be disabled */
        disabled?: boolean;

        /** Whenever or not the command should be hidden from the help command */
        hidden?: boolean;

        /** Whenever or not the command should be executed in an "NSFW" channel */
        nsfw?: boolean;

        /** The cooldown amount in seconds */
        throttle?: number;
    }

    /** The description supplier as an function */
    export type DescriptionSupplier = (client: Kotori.Client) => string;

    /** Type defintion for: `ManagerOptions` */
    export type ManagerOptions = { 
        /** The path to add x from */
        path: string; 
    }

    /** Type definition for: `Emittable` */
    export type Emittable = "ready" | "disconnect" | "callCreate" | "callRing" | "callDelete" | 
    "callUpdate" | "channelCreate" | "channelDelete" | "channelPinUpdate" | "channelRecipientAdd"  | 
    "channelRecepientRemove" | "channelUpdate" | "friendSuggestionCreate" | "friendSuggestionDelete" | "guildAvaliable" | 
    "guildBanAdd" | "guildBanRemove" | "guildDelete" | "guildUnavaliable" | 
    "guildCreate" | "guildEmojisUpdate" | "guildMemberAdd" | "guildMemberChunk" | "guildMemberRemove" | "guildMemberUpdate" | 
    "guildRoleCreate" | "guildRoleDelete" | "guildRoleUpdate" | "guildUpdate" | "hello" | "messageCreate" | "messageDeleteBulk" | 
    "messageReactionRemoveAll" | "messageDeleteBulk" | "messageDelete" | "messageReactionAdd" | "messageReactionRemove" | "messageUpdate" | 
    "presenceUpdate" | "rawWS" | "unknown" | "relationshipAdd" | "relationshipRemove" | 
    "relationshipUpdate" | "typingStart" | "unavaliableGuildCreate" | "userUpdate" | "voiceChannelJoin" | "voiceChannelLeave" | 
    "voiceChannelSwitch" | "voiceStateUpdate" | "warn" | "debug" | "shardDisconnect" | "error" | "shardPreReady" | "connect" | 
    "shardReady" | "shardResume";

    /** Type defintion for: `DatabaseManagerOptions` */
    export type DatabaseManagerOptions = {
        /** The url to authenicate with MongoDB */
        url: string;
    }

    /** Type defitinion for: `IDestroyResult` */
    export type IDestroyResult = {
        /** If it was successful or not */
        success: boolean;

        /** If it failed to destroy */
        error?: Error;
    }

    /** Guild Settings */
    export type IGuildSettings = {
        guildID: string;
        prefix: string;
        reddit: {
            enabled: boolean;
            channelID: string;
        };
        starboard: {
            enabled: boolean;
            channelID: string;
            emoji: string;
            threshold: number;
        };
        modlog: {
            enabled: boolean;
            channelID: string;
        };
        suggestions: {
            enabled: boolean;
            channelID: string;
            upvotes: { emoji: string; amount: number; }
            downvotes: { emoji: string; amount: number; }
        };
        tags: {
            userID: string;
            content: string;
        }[];
        autoroles: string[];
        assignable: string[];
        blacklist: { is: boolean; reason: string; }
    }

    /** Type definiton for: `MessageFilter` */
    export type MessageFilter = (msg: Eris.Message) => boolean;

    /** Type definition for: `MessageCollectorOptions` */
    export type MessageCollectorOptions = {
        /** The channel ID */
        channelID: string;

        /** The user's ID */
        userID: string;

        /** Timeout number (default: `30`) */
        timeout?: number;
    }

    /** Permission resolvable */
    export type PermissionResolvable = string | number | number[];

    /** Permission nodes */
    export type Permission = "createInstantInvite" | "kickMembers" | "banMembers" | 
    "administrator" | "manageChannels" | "manageGuild" | "addReactions" | "viewAuditLogs" | "voicePrioritySpeaker" | 
    "readMessages" | "sendMessages" | "sendTTSMessages" | "manageMessages" | "embedLinks" | "attachFiles" | "readMessageHistory" | 
    "mentionEveryone" | "externalEmojis" | "voiceConnect" | "voiceSpeak" | "voiceMuteMembers" | "voiceDeafenMembers"| 
    "voiceUseVAD" | "changeNickname" | "manageNicknames" | "manageRoles" | "manageWebhooks" | "manageEmojis";

    /** Type definiton for: `SchedulerOptions` */
    export type SchedulerOptions = {
        /** The scheduler name */
        name: string;

        /** Interval number */
        interval: number;

        /** If the scheduler should be disabled */
        disabled?: boolean;
    };

    export type IUserSettings = {
        userID: string;
        locale: string;
        coins: number;
        profile: {
            description: string;
            badge: string;
        }
    }

    // #endregion Types
}

declare module '@maika.xyz/kotori' { 
    export = Kotori; 
}