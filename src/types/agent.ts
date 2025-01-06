export interface AgentCharacter {
	age: string;
	gender: string;
	traits: string[];
	speakingStyle: string;
	interests: string[];
	catchphrase: string;
	appearance: {
		height?: string;
		build?: string;
		style?: string;
		features?: string[];
	};
	personality: {
		strengths: string[];
		weaknesses: string[];
		values: string[];
		motivations: string[];
		habits: string[];
		communication: {
			style: string;
			tone: string;
			vocabulary: string;
			expressions: string[];
			mannerisms: string[];
		};
	};
	backgroundInfo: {
		education: string;
		career: string;
		achievements: string[];
		lifeEvents: string[];
		influences: string[];
	};
	relationships: {
		family?: string;
		friends?: string;
		colleagues?: string;
		socialStyle: string;
	};
	dailyLife: {
		routine: string;
		hobbies: string[];
		preferences: {
			likes: string[];
			dislikes: string[];
		};
		goals: {
			short_term: string[];
			long_term: string[];
		};
	};
	skillset: {
		skills: string[];
		knowledge: string[];
		certifications?: string[];
		specialties: string[];
		experience: string;
	};
}

export interface Agent {
	id: string;
	name: string;
	avatarUrl: string;
	personality: string;
	systemPrompt: string;
	isDefault: boolean;
	createdAt: Date;
	updatedAt: Date;
	userId?: string;
	character: AgentCharacter;
}

export interface AgentResponse {
	message: string;
	tone: "friendly" | "professional" | "casual" | "formal";
	suggestions?: {
		title: string;
		description: string;
		action: string;
	}[];
}

export interface AgentSettings {
	preferredAgent: string; // エージェントID
	interactionStyle: "proactive" | "reactive";
	notificationPreferences: {
		taskReminders: boolean;
		dailyUpdates: boolean;
		weeklyReports: boolean;
	};
}
