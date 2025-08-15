<script setup lang="ts">
const teams = defineModel<Array<TeamData>>('data', { required: true, default: [] });
defineProps<{
	students: Array<{ userId: string; name: string; number: string; gender: string; avatarUrl: string }>;
}>();
interface TeamData {
	id: string;
	name: string;
	sort: number;
	leaderId: string;
	userIds: string[];
	groupId: string;
	groupName: string;
}

const dragStart = (event: DragEvent, teamId: string, memberId: string) => {
	if (event.dataTransfer) {
		event.dataTransfer.setData('text/plain', JSON.stringify({ teamId, memberId }));
	}
};

const dragOver = (event: DragEvent) => {
	event.preventDefault();
};

const drop = (event: DragEvent, targetTeamId: string) => {
	event.preventDefault();
	const data = event.dataTransfer?.getData('text/plain');
	if (data) {
		const { teamId: sourceTeamId, memberId } = JSON.parse(data);
		if (sourceTeamId !== targetTeamId) {
			const sourceTeam = teams.value.find((team) => team.id === sourceTeamId);
			const targetTeam = teams.value.find((team) => team.id === targetTeamId);
			if (sourceTeam && targetTeam) {
				const memberIndex = sourceTeam.userIds.indexOf(memberId);
				if (memberIndex !== -1) {
					sourceTeam.userIds.splice(memberIndex, 1);
					targetTeam.userIds.push(memberId);
				}
			}
		}
	}
	emits('update:team');
};

const sortedTeams = computed(() => {
	return teams.value.map((team) => ({
		...team,
		sortedUserIds: [team.leaderId, ...team.userIds.filter((id) => id !== team.leaderId)],
	}));
});

const groups = ref<Option[]>([]);

onMounted(() => {
	teams.value.forEach((item) => {
		if (groups.value.findIndex((v) => v.value === item.groupId) === -1) {
			groups.value.push({ value: item.groupId, label: item.groupName });
		}
	});
});

const setLeader = (teamId: string, userId: string) => {
	const team = teams.value.find((item) => item.id === teamId);
	if (team) {
		team.userIds = [userId, ...team.userIds.filter((v) => v !== userId)];
		team.leaderId = userId;
	}
};

const emits = defineEmits(['update:team']);
</script>

<template>
	<div class="grid gap-4 grid-cols-3" v-if="groups.length === 1">
		<div
			v-for="team in sortedTeams"
			:key="team.id"
			class="bg-blue-100 rounded"
			@dragover="dragOver"
			@drop="(event) => drop(event, team.id)"
		>
			<div class="justify-between flex px-2 leading-8 border-b border-b-white">
				<div>{{ team.name }}</div>
				<div class="font-mono">{{ team.userIds.length }}人</div>
			</div>
			<div v-auto-animate>
				<div
					v-for="member in team.sortedUserIds"
					class="flex justify-between rounded font-mono select-none cursor-pointer p-2 group"
					:draggable="member !== team.leaderId"
					@dragstart="(event) => dragStart(event, team.id, member)"
					:key="member"
				>
					<div class="flex">
						<div class="w-16">{{ $props.students.find((item) => item.userId === member)!.name }}</div>
						<div>{{ $props.students.find((item) => item.userId === member)!.number }}</div>
					</div>
					<div v-if="member === team.leaderId">
						<a-tag color="#108ee9">组长</a-tag>
					</div>
					<div
						v-else
						class="group-hover:opacity-100 opacity-0 transition-opacity text-xs leading-[22px]"
						@click="setLeader(team.id, member)"
					>
						<span>设为组长</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<template v-else>
		<a-tabs size="small">
			<a-tab-pane v-for="group in groups" :tab="group.label" :key="group.label">
				<div class="grid gap-4 grid-cols-4">
					<div
						v-for="team in sortedTeams.filter((v) => v.groupId === group.value)"
						:key="team.id"
						class="bg-blue-100 rounded"
						@dragover="dragOver"
						@drop="(event) => drop(event, team.id)"
					>
						<div class="justify-between flex px-2 leading-8 border-b border-b-white">
							<div>{{ team.name }}</div>
							<div class="font-mono">{{ team.userIds.length }}人</div>
						</div>
						<div v-auto-animate>
							<div
								v-for="member in team.sortedUserIds"
								class="flex justify-between rounded font-mono select-none cursor-pointer p-2 group"
								:draggable="member !== team.leaderId"
								@dragstart="(event) => dragStart(event, team.id, member)"
								:key="member"
							>
								<div class="flex">
									<div class="w-16">{{ $props.students.find((item) => item.userId === member)!.name }}</div>
									<div class="text-neutral-600">
										{{ $props.students.find((item) => item.userId === member)!.number }}
									</div>
								</div>
								<div v-if="member === team.leaderId">
									<a-tag color="#108ee9">组长</a-tag>
								</div>
								<div
									v-else
									class="group-hover:opacity-100 opacity-0 transition-opacity text-xs leading-[22px]"
									@click="setLeader(team.id, member)"
								>
									<span>设为组长</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</a-tab-pane>
		</a-tabs>
	</template>
</template>

<style scoped></style>
