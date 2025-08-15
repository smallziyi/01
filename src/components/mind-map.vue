<script setup lang="ts">
import { ref } from 'vue';

interface TreeNode {
	id: string;
	name: string;
	children: TreeNode[];
	isExpanded?: boolean;
}

const tree = ref<TreeNode>({
	id: '1',
	name: '1',
	isExpanded: false,
	children: [
		{
			id: '1-1',
			name: '1-1',
			children: [
				{ id: '1-1-1', name: '1-1-1', children: [] },
				{ id: '1-1-2', name: '1-1-2', children: [] },
				{ id: '1-1-3', name: '1-1-3', children: [] },
			],
		},
		{
			id: '1-2',
			name: '1-2',
			children: [
				{ id: '1-2-1', name: '1-2-1', children: [] },
				{ id: '1-2-2', name: '1-2-2', children: [] },
				{ id: '1-2-3', name: '1-2-3', children: [] },
			],
		},
	],
});

const toggleChildren = (node: TreeNode) => {
	node.isExpanded = !node.isExpanded;
};
</script>

<template>
	<div class="mind-map">
		<div class="node">
			<div class="content" @click="toggleChildren(tree)">{{ tree.name }}</div>
			<div v-if="tree.isExpanded" class="children">
				<div v-for="child in tree.children" :key="child.id" class="child">
					<div class="content" @click="toggleChildren(child)">{{ child.name }}</div>
					<div v-if="child.isExpanded" class="children">
						<div v-for="grandChild in child.children" :key="grandChild.id" class="child">
							<div class="content">{{ grandChild.name }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.mind-map {
	font-family: Arial, sans-serif;
	padding: 20px;
	display: flex;
}

.node {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
}

.content {
	padding: 5px 10px;
	border: 1px solid #b4d3ff;
	border-radius: 5px;
	background-color: #f9f9f9;
	cursor: pointer;
	margin: 5px;
	white-space: nowrap;
	position: relative;
}

.children {
	display: flex;
	flex-direction: column;
	margin-left: 30px;
	position: relative;
}

.child {
	display: flex;
	flex-direction: row;
	align-items: center;
	position: relative;
}

.child::before {
	content: '';
	position: absolute;
	top: 50%;
	left: -30px;
	width: 30px;
	height: 1px;
	background-color: #b4d3ff;
}

.child .content::before {
	content: '';
	position: absolute;
	top: 50%;
	left: -15px;
	width: 15px;
	height: 1px;
	background-color: #b4d3ff;
}

.children::after {
	content: '';
	position: absolute;
	top: 0;
	bottom: 0;
	left: -15px;
	width: 1px;
	background-color: #b4d3ff;
}
</style>
