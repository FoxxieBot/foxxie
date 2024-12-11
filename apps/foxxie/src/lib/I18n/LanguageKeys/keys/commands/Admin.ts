import { FT, type HelpDisplayData, T } from '#lib/types';

export const ConfGet = FT<{ key: string; value: string }, string>('commands/admin:confGet');
export const ConfGetNoExt = FT<{ key: string }, string>('commands/admin:confGetNoExt');
export const ConfMenuInvalidAction = T<string>('commands/admin:confMenuInvalidAction');
export const ConfMenuInvalidKey = T<string>('commands/admin:confMenuInvalidKey');
export const ConfMenuRenderAtFolder = FT<{ path: string }, string>('commands/admin:confMenuRenderAtFolder');
export const ConfMenuRenderAtPiece = FT<{ path: string }, string>('commands/admin:confMenuRenderAtPiece');
export const ConfMenuRenderBack = T<string>('commands/admin:confMenuRenderBack');
export const ConfMenuRenderCvalue = FT<{ value: string }, string>('commands/admin:confMenuRenderCvalue');
export const ConfMenuRenderNokeys = T<string>('commands/admin:confMenuRenderNokeys');
export const ConfMenuRenderRemove = T<string>('commands/admin:confMenuRenderRemove');
export const ConfMenuRenderReset = T<string>('commands/admin:confMenuRenderReset');
export const ConfMenuRenderSelect = T<string>('commands/admin:confMenuRenderSelect');
export const ConfMenuRenderUndo = T<string>('commands/admin:confMenuRenderUndo');
export const ConfMenuRenderUpdate = T<string>('commands/admin:confMenuRenderUpdate');
export const ConfMenuSaved = T<string>('commands/admin:confMenuSaved');
export const ConfNochange = FT<{ key: string }, string>('commands/admin:confNochange');
export const ConfReset = FT<{ key: string; value: string }, string>('commands/admin:confReset');
export const Conf = FT<{ key: string; list: string }, string>('commands/admin:confServer');
export const ConfDescription = T<string>('commands/admin:confServerDescription');
export const ConfExtended = T<HelpDisplayData>('commands/admin:confServerExtended');
export const ConfSettingNotSet = T<string>('commands/admin:confSettingNotSet');
export const ConfUpdated = FT<{ key: string; response: string }, string>('commands/admin:confUpdated');
export const ConfDashboardOnlyKey = FT<{ key: string }, string>('commands/admin:confDashboardOnlyKey');

export const EvalConsole = FT<{ footer: string; name: string; time: string }>('commands/admin:evalConsole');
export const EvalDescription = T('commands/admin:evalDescription');
export const EvalError = FT<{ output: string; time: string; type: string }>('commands/admin:evalError');
export const EvalHaste = FT<{ footer: string; output: string; time: string }>('commands/admin:evalHaste');
export const EvalOutput = FT<{ footer: string; output: string; time: string }>('commands/admin:evalOutput');
export const Reload = FT<{ name: string; time: string; type: string }>('commands/admin:reload');
export const ReloadAll = FT<{ time: string; type: string }>('commands/admin:reloadAll');
export const ReloadDescription = T('commands/admin:reloadDescription');
export const ReloadDetailedDescription = T<HelpDisplayData>('commands/admin:reloadDetailedDescription');
export const ReloadEverything = FT<{ time: string }>('commands/admin:reloadEverything');
export const ReloadLanguage = FT<{ language: string; time: string }>('commands/admin:reloadLanguage');
export const ServerlistDescription = T('commands/admin:serverlistDescription');
export const ServerlistDetailedDescription = T<HelpDisplayData>('commands/admin:serverlistDetailedDescription');
export const ServerlistFooter = FT<{ count: number }>('commands/admin:serverlistFooter');
export const ServerlistMembers = T('commands/admin:serverlistMembers');
export const ServerlistTitle = FT<{ name: string }>('commands/admin:serverlistTitle');
