<script setup lang="ts">
import ClientSvg from '@/assets/menu/client.svg';
import RoleSvg from '@/assets/menu/role.svg';
import PeopleSvg from '@/assets/menu/people.svg';
import TemplateSvg from '@/assets/menu/template.svg';
import CodeSvg from '@/assets/menu/code.svg';
import OrganizationSvg from '@/assets/menu/organization.svg';
import OrientationSvg from '@/assets/menu/orientation.svg';
import CourseDevelopSvg from '@/assets/menu/course-develop.svg';
import InstructionSvg from '@/assets/menu/instruction.svg';
import ResourceSvg from '@/assets/menu/resource.svg';
import AnalysisSvg from '@/assets/menu/analyse.svg';

const svgIcon: any = {
	admin_system: RoleSvg,
	admin_manage: ClientSvg,
	admin_encoding: CodeSvg,
	school_system: RoleSvg,
	school_organization: OrganizationSvg,
	school_personnel: PeopleSvg,
	template_file_manage: TemplateSvg,
	school_orientation: OrientationSvg,
	school_develop: CourseDevelopSvg,
	school_instruction: InstructionSvg,
	school_resource: ResourceSvg,
	school_analysis: AnalysisSvg,
};

const { icon } = defineProps<{
	icon: string;
}>();
</script>

<template>
	<component :is="svgIcon[icon]" />
</template>
