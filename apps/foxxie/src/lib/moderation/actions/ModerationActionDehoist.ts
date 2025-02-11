import { ModerationAction } from '#lib/moderation/actions/base/ModerationAction';
import { TypeVariation } from '#utils/moderationConstants';

export class ModerationActionDehoist extends ModerationAction<number, TypeVariation.Dehoist> {
	public constructor() {
		super({
			isUndoActionAvailable: true,
			logPrefix: 'Moderation => Dehoist',
			type: TypeVariation.Dehoist
		});
	}
}
