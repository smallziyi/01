<script setup lang="ts">
import { ReportStatusStatistic, ReportType } from '@/view/__report';
import useAppTheme from '@/hooks/useAppTheme.ts';
import MBreadcrumb from '@/components/m-breadcrumb.vue';
import { getReportStatusStatistic } from '@/axios';

const props = defineProps<{ reportType: ReportType }>();

const data = ref<ReportStatusStatistic>({ 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
const count = ref(0);

const fixedPercent = (percent: number) => {
	return +((percent / count.value) * 100).toFixed(2);
};

onMounted(() => {
	getReportStatusStatistic(props.reportType).then((res) => {
		data.value = res;
		count.value = Object.values(data.value).reduce((accumulator, current) => accumulator + current, 0);
	});
});

const { appTheme } = useAppTheme();
</script>

<template>
	<a-card :body-style="{ padding: '22px 32px' }" :bordered="false" size="small">
		<template #title>
			<m-breadcrumb></m-breadcrumb>
		</template>
		<div class="card-title text-lg font-bold leading-none mb-4">关键指标（总计：{{ count }}条）</div>
		<div class="grid grid-cols-5 gap-4">
			<div class="rounded-lg card1 border border-solid border-[#F5F7FA] h-28">
				<div class="flex justify-end">
					<svg width="90px" height="24px" viewBox="0 0 90 24">
						<title>239B1684-5E3E-4FA6-95F0-4ACAECC2B8DB@0.0x</title>
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g transform="translate(-332, -2804)">
								<g transform="translate(332, 2804)">
									<path
										d="M0,0 L0,0 L0,0 L83.0004867,-8.8817842e-16 C86.8664799,-1.59834986e-15 90.0004867,3.13400675 90.0004867,7 L90.0004867,24 L90.0004867,24 L15.2678168,24 C10.0395486,24 5.69374711,19.9726023 5.29669535,14.7594327 L4.68349158,6.70825224 C4.46091951,3.78594821 2.66662316,1.21594412 -2.94855539e-15,-1.30776434e-15 Z"
										fill="#0091FF"
									></path>
									<text
										font-family="MicrosoftYaHei-Bold, Microsoft YaHei"
										font-size="14"
										font-weight="bold"
										fill="#FFFFFF"
									>
										<tspan x="39.0004867" y="17">编辑中</tspan>
									</text>
								</g>
							</g>
						</g>
					</svg>
				</div>
				<div class="flex justify-center py-[15px] gap-4">
					<a-progress
						:size="60"
						:strokeWidth="15"
						type="circle"
						:percent="fixedPercent(data[2])"
						:trail-color="appTheme === 'blue' ? '#f5f7fa' : ''"
						:format="
							(percent) => {
								return `${+percent!.toFixed(0)}%`;
							}
						"
					></a-progress>
					<a-divider type="vertical" style="height: 60px" dashed />
					<div>
						<div class="text-black/80">记录数:</div>
						<span class="text-black text-2xl">{{ data[2] }}</span>
					</div>
				</div>
			</div>
			<div class="rounded-lg card2 border border-solid border-[#F5F7FA] h-28">
				<div class="leading-8 text-right">
					<div class="flex justify-end">
						<svg width="90px" height="24px" viewBox="0 0 90 24">
							<title>A9162723-E167-490C-94A7-9616FEBA7B71@0.0x</title>
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g transform="translate(-459, -2804)">
									<g transform="translate(459, 2804)">
										<path
											d="M0,0 L0,0 L0,0 L83.0004867,-8.8817842e-16 C86.8664799,-1.59834986e-15 90.0004867,3.13400675 90.0004867,7 L90.0004867,24 L90.0004867,24 L15.2678168,24 C10.0395486,24 5.69374711,19.9726023 5.29669535,14.7594327 L4.68349158,6.70825224 C4.46091951,3.78594821 2.66662316,1.21594412 -2.94855539e-15,-1.30776434e-15 Z"
											fill="#F0AE43"
										></path>
										<text
											font-family="MicrosoftYaHei-Bold, Microsoft YaHei"
											font-size="14"
											font-weight="bold"
											fill="#FFFFFF"
										>
											<tspan x="39.0004867" y="17">审核中</tspan>
										</text>
									</g>
								</g>
							</g>
						</svg>
					</div>
				</div>
				<div class="flex justify-center py-[15px] gap-4">
					<a-progress
						:size="60"
						:strokeWidth="15"
						:trail-color="appTheme === 'blue' ? '#f5f7fa' : ''"
						type="circle"
						:percent="fixedPercent(data[4])"
						:format="
							(percent) => {
								return `${+percent!.toFixed(0)}%`;
							}
						"
					/>
					<a-divider type="vertical" style="height: 60px" dashed />
					<div>
						<div class="text-black/80">记录数:</div>
						<span class="text-black text-2xl">{{ data[4] }}</span>
					</div>
				</div>
			</div>
			<div class="rounded-lg card3 border border-solid border-[#F5F7FA] h-28">
				<div class="leading-8 text-right">
					<div class="flex justify-end">
						<svg width="90px" height="24px" viewBox="0 0 90 24">
							<defs>
								<linearGradient x1="50%" y1="1.66533454e-14%" x2="50%" y2="53.5116282%" id="linearGradient-1">
									<stop stop-color="#68D1A5" offset="0%"></stop>
									<stop stop-color="#68D1A5" offset="100%"></stop>
								</linearGradient>
							</defs>
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g transform="translate(-586, -2804)">
									<g transform="translate(586, 2804)">
										<path
											d="M0,0 L0,0 L0,0 L83.0004867,-8.8817842e-16 C86.8664799,-1.59834986e-15 90.0004867,3.13400675 90.0004867,7 L90.0004867,24 L90.0004867,24 L15.2678168,24 C10.0395486,24 5.69374711,19.9726023 5.29669535,14.7594327 L4.68349158,6.70825224 C4.46091951,3.78594821 2.66662316,1.21594412 -2.94855539e-15,-1.30776434e-15 Z"
											fill="url(#linearGradient-1)"
										></path>
										<text
											font-family="MicrosoftYaHei-Bold, Microsoft YaHei"
											font-size="14"
											font-weight="bold"
											fill="#FFFFFF"
										>
											<tspan x="25.0004867" y="17">审核通过</tspan>
										</text>
									</g>
								</g>
							</g>
						</svg>
					</div>
				</div>
				<div class="flex justify-center py-[15px] gap-4">
					<a-progress
						:size="60"
						:trail-color="appTheme === 'blue' ? '#f5f7fa' : ''"
						type="circle"
						:percent="fixedPercent(data[5])"
						:strokeWidth="15"
						:format="
							(percent) => {
								return `${+percent!.toFixed(0)}%`;
							}
						"
					/>
					<a-divider type="vertical" style="height: 60px" dashed />
					<div>
						<div class="text-black/80">记录数:</div>
						<span class="text-black text-2xl">{{ data[5] }}</span>
					</div>
				</div>
			</div>
			<div class="rounded-lg card4 border border-solid border-[#F5F7FA] h-28">
				<div class="leading-8 text-right">
					<div class="flex justify-end">
						<svg width="90px" height="24px" viewBox="0 0 90 24">
							<title>C18660AA-15CA-4A2B-9059-BE0958B3748C@0.0x</title>
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g transform="translate(-713, -2804)">
									<g transform="translate(713, 2804)">
										<path
											d="M0,0 L0,0 L0,0 L83.0004867,-8.8817842e-16 C86.8664799,-1.59834986e-15 90.0004867,3.13400675 90.0004867,7 L90.0004867,24 L90.0004867,24 L15.2678168,24 C10.0395486,24 5.69374711,19.9726023 5.29669535,14.7594327 L4.68349158,6.70825224 C4.46091951,3.78594821 2.66662316,1.21594412 -2.94855539e-15,-1.30776434e-15 Z"
											fill="#EC5156"
										></path>
										<text
											font-family="MicrosoftYaHei-Bold, Microsoft YaHei"
											font-size="14"
											font-weight="bold"
											fill="#FFFFFF"
										>
											<tspan x="39.0004867" y="17">已驳回</tspan>
										</text>
									</g>
								</g>
							</g>
						</svg>
					</div>
				</div>
				<div class="flex justify-center py-[15px] gap-4">
					<a-progress
						:size="60"
						type="circle"
						:trail-color="appTheme === 'blue' ? '#f5f7fa' : ''"
						:percent="fixedPercent(data[3])"
						:strokeWidth="15"
						:format="
							(percent) => {
								return `${+percent!.toFixed(0)}%`;
							}
						"
					/>
					<a-divider type="vertical" style="height: 60px" dashed />
					<div>
						<div class="text-black/80">记录数:</div>
						<span class="text-black text-2xl">{{ data[3] }}</span>
					</div>
				</div>
			</div>
			<div class="rounded-lg card5 border border-solid border-[#F5F7FA] h-28">
				<div class="leading-8 text-right">
					<div class="flex justify-end">
						<svg width="90px" height="24px" viewBox="0 0 90 24" xmlns="http://www.w3.org/2000/svg">
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g transform="translate(-840, -2804)">
									<g transform="translate(840, 2804)">
										<path
											d="M0,0 L0,0 L0,0 L83.0004867,-8.8817842e-16 C86.8664799,-1.59834986e-15 90.0004867,3.13400675 90.0004867,7 L90.0004867,24 L90.0004867,24 L15.2678168,24 C10.0395486,24 5.69374711,19.9726023 5.29669535,14.7594327 L4.68349158,6.70825224 C4.46091951,3.78594821 2.66662316,1.21594412 -2.94855539e-15,-1.30776434e-15 Z"
											fill="#899ECC"
										></path>
										<text
											font-family="MicrosoftYaHei-Bold, Microsoft YaHei"
											font-size="14"
											font-weight="bold"
											fill="#FFFFFF"
										>
											<tspan x="11.0004867" y="17">审核未通过</tspan>
										</text>
									</g>
								</g>
							</g>
						</svg>
					</div>
				</div>
				<div class="flex justify-center py-[15px] gap-4">
					<a-progress
						:size="60"
						type="circle"
						:trail-color="appTheme === 'blue' ? '#f5f7fa' : ''"
						:percent="fixedPercent(data[6])"
						:strokeWidth="15"
						:format="
							(percent) => {
								return `${+percent!.toFixed(0)}%`;
							}
						"
					/>
					<a-divider type="vertical" style="height: 60px" dashed />
					<div>
						<div class="text-black/80">记录数:</div>
						<span class="text-black text-2xl">{{ data[6] }}</span>
					</div>
				</div>
			</div>
		</div>
	</a-card>
</template>

<style scoped>
.card1 {
	background: linear-gradient(180deg, rgba(217, 239, 255, 1) 0%, rgba(255, 255, 255, 1) 100%);
}
.card2 {
	background: linear-gradient(180deg, rgba(242, 230, 210, 1) 0%, rgba(255, 255, 255, 1) 100%);
}
.card3 {
	background: linear-gradient(180deg, rgba(198, 236, 221, 1) 0%, rgba(255, 255, 255, 1) 100%);
}
.card4 {
	background: linear-gradient(180deg, rgba(250, 217, 218, 1) 0%, rgba(255, 255, 255, 1) 100%);
}
.card5 {
	background: linear-gradient(180deg, rgba(224, 230, 245, 1) 0%, rgba(255, 255, 255, 1) 100%);
}

:deep(.ant-progress-text) {
	color: black !important;
}
</style>
