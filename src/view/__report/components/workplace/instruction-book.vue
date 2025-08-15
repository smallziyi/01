<script setup lang="ts">
import { theme } from 'ant-design-vue';
import useReportInfo from '@/view/__report/components/workplace/useReportInfo.ts';

defineOptions({
	name: 'InstructionBook',
});
type TextList = string[];
const props = defineProps<{
	type?: keyof typeof typeMappings;
}>();

const { reportInfo } = useReportInfo();

// 企业调研
const backgroundList: TextList = [
	'“调研背景”需要明确行业企业发展的现状和趋势，是“调研意义”的基础，需要行业企业调研数据支撑；',
	'调研数据需要有逻辑层次，即可以按照“世界—中国—区域”的层次逐层剖析，但是重心必须落在“区域”的产业、行业和企业发展，突出职业教育服务于区域经济发展的重要职能；',
	'行业企业发展现状和趋势要突出“三主三辅”，即以世界和全国的生产技术水平的升级、规模和数量变化、岗位职责范畴的变动为辅，而以区域和本地的生产技术水平升级、岗位和典型行动场变迁和工作过程幅度的变化为主；',
	'典型行动场，即以往的术语“典型工作任务”，指的是“行动、物理场和心理场”相互共构的行为的集合，体现的是“主体—物理环境—精神世界”的和谐共生。',
];
const meaningList: TextList = [
	'“调研意义”需要围绕消除职业教育专业（群/链）的“人才培养的结构性矛盾”思考，因此必须从“专业定位、人才培养目标定位、教学目标定位”三个层面进行阐述；',
	'专业定位方面，必须研究岗位分布的情况，并按照“岗位类型变化—人才培养的类型定位、岗位层次变化—人才培养的层次的定位、岗位人数变化—人才培养的规模定位”三个维度进行数据分析；',
	'人才培养目标定位方面，必须研究岗位的典型行动场的变化情况，并按照“（典型）行动场类型变化—课程类型（学习场）定位、工作过程变化—课程内容遴选、（工作环节）的工作要求变化—职业素质确定”三个维度进行数据分析；',
	'教学目标定位方面，按照“课程类型变化—课程范式转变、课程内容变化—教学范式转变、职业素质变化—评价范式转变”三个维度进行剖析。',
];

const commonList: TextList = [
	'本部分内容需要行业企业调研数据支撑；',
	'本部分表中的职业内容描述维度需要根据具体情况灵活掌握和合理取舍，不要生搬硬套。',
];

const workProcessList: TextList = [
	'本部分内容需要行业企业调研数据支撑；',
	'本部分表中需要根据实际情况决定是否填写“工作方法、工作对象、使用工具、劳动组织或工作形式”等要素，不要生搬硬套；',
	'按照实际调研情况，有几个行动场就填写几个表格。',
];

// 专业建设建议
const constructionList: TextList = [
	'专业定位方面，必须研究岗位分布的情况，并按照“岗位类型变化—人才培养的类型定位、岗位层次变化—人才培养的层次的定位、岗位人数变化—人才培养的规模定位”三个维度进行数据分析；',
	'人才培养目标定位方面，必须研究岗位的典型行动场的变化情况，并按照“（典型）行动场类型变化—课程类型（学习场）定位、工作过程变化—课程内容遴选、（工作环节）的工作要求变化—职业素质确定”三个维度进行数据分析。',
];

const courseResourceList: TextList = [
	'必须要结合《专业课程体系结构表》中的每个学习场以及现有的课程资源，论述课程资源是否够用，如何配备或者配置。',
];

const teacherConfigList: TextList = [
	'第一，必须结合上述《专业课程体系结构表》中的每个学习场以及现有的教师资源，论述现有教师资源是否够用？',
	'第二，必须结合上述《专业课程体系结构表》中的每个学习场，论述如何配备或者配置教师资源？是否需要企业的教师资源，以及引进该企业教师资源的理由。',
];

const teacherResourceList: TextList = [
	'第一，必须结合上述《专业课程体系结构表》中的每个学习场以及现有的实训基地等教学资源，论述现有的教学资源是否够用？',
	'第二，必须结合上述《专业课程体系结构表》中的每个学习场，论述如何配备或者配置教学资源？',
	'第三，必须结合上述《专业课程体系结构表》中的每个学习场，论述是否需要企业的实习实训基地等教学资源，以及引进该企业的实习实训基地等教学资源的理由。',
];

// 其他方面建议
const otherList: TextList = [
	'制度建设、标准建设、考核评价等各方面的建议，均需要结合上述《专业课程体系结构表》中的每个学习场进行论述。',
];

// 专业课程建议
const courseStructureList: TextList = [
	'第一，调研的行动场转化为学习场，学习场即学习性的行动场，它们是该专业的专业核心课程体系；',
	'第二，学习场的排序要按照学生的认知发展规律和学习场的难易程度进行排列；',
	'第三，各个专业要论述和说明这些学习场排序的依据和理由；',
	'第四，各个学习场均应该是按照工作过程系统化课程开发范式形成的专业课程，它们均为面向对象、以过程为载体、理实一体、行动导向、结果导向的课程形态，因此必须以单一的动宾结构命名，且拒绝以“认知、认识、理解、背诵、记忆、识别”这样的“无产品输出”的动词引导动宾结构；',
	'第五，“（专业）课程结构建议”的各个学习场必须与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系。',
];

// 人才培养方案
const cultivateGoalsList: TextList = [
	'请根据《行业企业调研报告》中“专业建设定位”中的“人才培养目标（数量、规格、层次）”阐述。',
];
const cultivateModeList: TextList = [
	'请根据《行业企业调研报告》中“专业建设定位”“课程体系设计”和“教学条件建议”等进行阐述。',
];
const employmentFieldList: TextList = ['请根据《行业企业调研报告》中“调研背景与意义”以及“调研结论”等进行阐述。'];
const employmentPositionRequirementsList: TextList = [
	'请根据《行业企业调研报告》中“调研实施”以及“调研结论”等进行阐述。',
];
const publicBasicCourseList: TextList = ['请根据教育部相关教学标准填写。'];
const vocationalCourseList: TextList = [
	'请根据《行业企业调研报告》中“课程体系设计”填写；特别要注意课程与相应的“1+X”证书/职业资格证书之间的融合关系。',
];
const careerDevelopmentCourseList: TextList = [
	'请根据创新创业等政策要求和学习者发展的需要等，灵活增加和补充的学习场的名称；特别要注意课程与相应的“1+X”证书/职业资格证书之间的融合关系。',
];
const graduationCourseList: TextList = [
	'请根据《行业企业调研报告》中“课程体系设计”“教学条件设计”等进行填写；特别要注意课程与相应的“1+X”证书/职业资格证书之间的融合关系。',
];
const teachingMethodList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些教学方法能够完成哪些学习场的教学？要突出“项目教学、案例教学、情境教学、模块化教学等教学方式，广泛运用启发式、探究式、讨论式、参与式等教学方法，推广翻转课堂、混合式教学、理实一体教学等新型教学模式”等行动导向教学方式方法。',
];
const teachingObjectiveList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；注意一定要与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系；',
];
const teachingConditionList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；注意一定要与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系；',
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些校内实训基地能够完成哪些学习场的教学？',
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些校外实训基地能够完成哪些学习场的教学？',
];
const teachingManagementList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；',
];
const organizationManagementList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；注意一定要与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系；',
];
const curriculumSystemList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；注意一定要与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系；',
];
const teachingModeList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；注意一定要与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系。',
];
const evaluationMethodList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”、特别是“课程体系设计”“教学条件设计”等、以及“1+X”证书制度的需要和学习者获得职业资格证的需要进行填写；',
];
const professionalTeachingTeamList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些专业带头人能够承担哪些学习场？',
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些骨干教师能够承担哪些学习场？',
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写主要说明这些专任教师能够承担哪些学习场？',
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些兼职教师能够承担哪些学习场？',
];
const learningResourcesList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些教材和自编讲义能够完成哪些学习场的教学？',
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些网络教学资源能够完成哪些学习场的教学？',
];
// 课程标准
const courseStandardDesignIdeasList: TextList = [
	'方法论：SWOP方法，具体流程示意图如下：',
	'具体方法：访谈法、问卷法、观察法等；',
	'调研工具：访谈提纲、问卷、观察记录表。',
	'标出本课程所在位置。',
];

const courseStandardCourseObjectivesList: TextList = [
	'本部分内容需要行业企业调研数据支撑；',
	'本部分表中需要根据实际情况决定是否填写“工作方法、工作对象、使用工具、劳动组织或工作形式、成果”等要素，不要生搬硬套；',
];

const courseStandardListOfProfessionalCourseSystemList: TextList = [
	'本部分根据课程设计的实际需要进行填写：',
	'请按照此表填写完整专业的全部学习场（课程），并用黑体标出本学习场（课程），完整呈现其前导学习场（课程）和后续学习场（课程）之间的关系；',
	'一个学习场就是一门课程，其名称需要使用单一的动宾结构或者名动结构命名（以下简称动宾结构，且推荐使用动宾结构）；但需要注意不可使用“认识、认知、判断、了解、理解、观察、思考”等没有结果输出的动词。',
];

const courseStandardSummaryTableCourseStructureList: TextList = [
	'学习场，即学习性的行动场，实质上就是专业课程，其来自于《企业调研报告》中的行动场，它是根据教育规律、心理学原理、教学条件和学习者的认知水平归纳和转化而来的行动场；行动场与学习场不一定具有严格的、一一对应的关系；一个学习场有可能对应若干个行动场；一门课程即一个学习场；',
	'“一般按照相应职业岗位（群）的能力要求，确定6—8门专业核心课程和若干门专业课程”，因此一个专业的学习场的数量大致在10个左右；其数量是否充足的根本标准是：这些学习场的数量必须能够涵盖该专业所对应的企业岗位（群）的行动场；',
	'参照系就是将一个学习场中划分成三个以上的学习性工作情境（即学习情境）学习情境的标准；参照系选择的范围是“工作的对象、内容、手段、组织、产品、环境等及其特征”；原则上，参照系可以任意选择；事实上，参照系的选择还是有要求的，即需要把握教育性、学习性、迁移性、同一范畴原则等原则，以及考虑学生情况、学院教学条件、区域经济发展情况。',
	'参照系不仅有类型的差别，还有级别的区分，其级别包括“门、纲、目、科、属、种”等；参照系的级别选的太高，会导致难以落实每个学习情境的教学内容，因此课程开发人员需要根据职业教育学习者的认识发展水平、技能迁移水平和职业教育的层次，合理选择参照系级别；',
	'在参照系级别太高而导致学习情境不能落地的情况下，课程开发人员还需要继续遴选二级参照系，从而在二级参照系的规定范畴内设计若干个学习性的工作任务；',
	'通过采用复杂参照系和降低参照系接别的方式，可以大幅减少学习情境和学习性工作任务的数量；但是不能为了减少学习情境和学习性工作任务的数量而损害学习者通过必要的重复并达成熟练技能的目的；',
	'学习情境和学习性工作任务的数量，以能够覆盖专业教学标准、达成岗位用工要求、促进学习者远迁移三个维度为评价标准；',
	'各个学习场、学习情境、学习性工作任务和每个典型工作环节均必须以单一的动宾结构命名，且杜绝以“认知、认识、理解、背诵、记忆、识别”这样的“无产品输出”的动词引导动宾结构；',
	'“该学习场的性质（课程性质）”指的是该学习场属于职业专业课（专业核心课程）、职业拓展课程等属性。',
];
const courseStandardLearningFieldStandardsDesignList: TextList = [
	'每个学习场必须是在同一个级别的参照系范畴内设计三个以上的学习情境；避免跨越不同的参照系级别设计学习情境；',
	'三个以上的学习情境最好能够是递进的关系，以便促进学生的技能迁移；',
	'同一个学习场中不同的学习情境、学习性工作任务的典型工作过程是相同的，它包含7±2个典型工作环节；',
	'每个典型工作环节的职业素质/课程目标需要使用7±2句动宾结构进行描述；典型工作过程的各个典型工作任务即典型工作过程的各个必要的工作步骤或者必要的工作环节；',
	'学习场、学习情境、学习性的工作任务、典型工作环节、职业素质/课程目标均需要采用符合要求的单一动宾结构进行描述；',
	'素质是包含知识、技能、能力等的上位概念，因此在对课程目标和职业素质进行描述时，尽量不要使用知识点、能力点、技能点、思政点等概念；',
];

const courseStandardLearningContextsStandardsDesignList: TextList = [
	'学习情境不具有可操作性的情况下，还需要设计学习性的工作任务；',
	'学习性的工作任务的数量根据教学目标和学生的发展需要确定；',
	'同一个学习情境下，各个学习性的工作任务的参照系必须坚持同一范畴的原则；',
	'同一个学习场中不同的学习情境下的学习性工作任务的参照系可以不同；',
	'其他要求同上。',
];

const courseStandardLearningWorkTasksStandardsDesignList: TextList = [
	'学习性工作任务的每个典型工作环节均需要使用按照时间顺序排列的动宾结构表述其职业素质/学习目标，数量控制在7±2句；',
	'表述其职业素质/学习目标动宾结构包括三个要素，即行动方向（必要要素）、目标值（充分要素）和保障措施（充分要素）；',
	'如烹饪酸辣土豆丝的“买菜”典型工作环节的课程目标/职业素质，可以这样描述：1. 购买土豆0.5Kg，注意不能购买绿皮或者发芽的土豆；2. 购买“芦花”牌食盐1袋，规格0.5Kg；3. 购买干红辣椒0.5 Kg；……',
];

const courseStandardTeachingMethodList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些教学方法能够完成哪些学习场的教学？要突出“项目教学、案例教学、情境教学、模块化教学等教学方式，广泛运用启发式、探究式、讨论式、参与式等教学方法，推广翻转课堂、混合式教学、理实一体教学等新型教学模式”等行动导向教学方式方法。',
];

const courseStandardTeachingDevicesList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些教学手段能够完成哪些学习场的教学？要突出“进信息技术与教学有机融合；适应‘互联网+职业教育’新要求，全面提升教师信息技术应用能力，推动大数据、人工智能、虚拟现实等现代信息技术在教育教学中的广泛应”等精神。',
];

const courseStandardTeachingOrganizationFormList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些教学组织形式能够完成哪些学习场的教学？要突出“翻转课堂、混合式教学、理实一体教学”和“生产性教学过程”等改革要点。',
];

const courseStandardTextbooksAndSelfMadeLectureNotesList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些教材和自编讲义能够完成哪些学习场的教学？',
];

const courseStandardOnlineVirtualTeachingResourcesList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些网络教学资源能够完成哪些学习场的教学？',
];

const courseStandardOnCampusTrainingBaseList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；注意一定要与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系；一定要科学、合理地说明是否需要虚拟实训、为什么需要虚拟实训和如何实现虚拟实训，切忌为了虚拟实训而虚拟实训。',
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些校内实训基地能够完成哪些学习场的教学？',
];

const courseStandardOutOfCampusTrainingBasesList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；注意一定要与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系；一定要科学、合理地说明是否需要虚拟实训、为什么需要虚拟实训和如何实现虚拟实训，切忌为了虚拟实训而虚拟实训。',
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；主要说明这些校外实训基地能够完成哪些学习场的教学？',
];

const courseStandardOtherTeachingConditionsList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；注意一定要与“1+X”证书制度/职业资格制度形成相互融通和相互对应的关系；一定要科学、合理地说明是否需要虚拟实训、为什么需要虚拟实训和如何实现虚拟实训，切忌为了虚拟实训而虚拟实训。',
];

const courseStandardTeachingEvaluationAssessmentRequirementsList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”，特别是“课程体系设计”“教学条件设计”等进行填写；',
];

const courseStandardEvaluationMethodsInternshipPracticalTrainingList: TextList = [
	'请根据《行业企业调研报告》中“调研结论”、特别是“课程体系设计”“教学条件设计”等、以及“1+X”证书制度的需要和学习者获得职业资格证的需要进行填写；一定要科学、合理地说明是否需要虚拟实训、为什么需要虚拟实训和如何实现虚拟实训，切忌为了虚拟实训而虚拟实训。',
];

const typeMappings: Record<string, TextList | undefined> = {
	// 企业调研
	background_1: backgroundList,
	background_2: backgroundList,
	background_3: backgroundList,
	meaning_1: meaningList,
	meaning_2: meaningList,
	meaning_3: meaningList,
	work_step: workProcessList,
	other_suggest: otherList,
	teacher_config: teacherConfigList,
	teacher_resource: teacherResourceList,
	domain_target: constructionList,
	talent_target: constructionList,
	course_structure: courseStructureList,
	major_qualification_certificate: courseStructureList,
	psychomotor_conversion_learning: courseStructureList,
	course_resource: courseResourceList,
	//  人才培养方案
	cultivate_goals: cultivateGoalsList,
	cultivate_mode: cultivateModeList,
	employment_field: employmentFieldList,
	employment_position_requirements: employmentPositionRequirementsList,
	public_basic_course: publicBasicCourseList,
	vocational_course: vocationalCourseList,
	career_development_course: careerDevelopmentCourseList,
	graduation_course: graduationCourseList,
	teaching_method: teachingMethodList,
	teaching_objective: teachingObjectiveList,
	teaching_condition: teachingConditionList,
	teaching_management: teachingManagementList,
	organization_management: organizationManagementList,
	curriculum_system: curriculumSystemList,
	teaching_mode: teachingModeList,
	evaluation_method: evaluationMethodList,
	professional_teaching_team: professionalTeachingTeamList,
	learning_resources: learningResourcesList,
	graduation_requirement: graduationCourseList,
	vocational_qualification_requirements: vocationalCourseList,
	// 课程标准
	course_standard_design_ideas: courseStandardDesignIdeasList,
	course_standard_course_objectives: courseStandardCourseObjectivesList,
	course_standard_list_of_professional_course_system: courseStandardListOfProfessionalCourseSystemList,
	course_standard_summary_table_course_structure: courseStandardSummaryTableCourseStructureList,
	course_standard_learning_field_standards_design: courseStandardLearningFieldStandardsDesignList,
	course_standard_learning_contexts_standards_design: courseStandardLearningContextsStandardsDesignList,
	course_standard_learning_work_tasks_standards_design: courseStandardLearningWorkTasksStandardsDesignList,
	course_standard_teaching_method: courseStandardTeachingMethodList,
	course_standard_teaching_devices: courseStandardTeachingDevicesList,
	course_standard_teaching_organization_form: courseStandardTeachingOrganizationFormList,
	course_standard_textbooks_and_self_made_lecture_notes: courseStandardTextbooksAndSelfMadeLectureNotesList,
	course_standard_online_virtual_teaching_resources: courseStandardOnlineVirtualTeachingResourcesList,
	course_standard_on_campus_training_base: courseStandardOnCampusTrainingBaseList,
	course_standard_out_of_campus_training_bases: courseStandardOutOfCampusTrainingBasesList,
	course_standard_other_teaching_conditions: courseStandardOtherTeachingConditionsList,
	course_standard_regular_teaching_evaluation: courseStandardTeachingEvaluationAssessmentRequirementsList,
	course_standard_regular_teaching_assessment: courseStandardTeachingEvaluationAssessmentRequirementsList,
	course_standard_evaluation_methods_internship_practical_training:
		courseStandardEvaluationMethodsInternshipPracticalTrainingList,
};

const textList = computed(() => {
	if (reportInfo.value.reportType === 1) {
		return typeMappings[props.type as keyof typeof typeMappings] ?? commonList;
	} else {
		return typeMappings[props.type as keyof typeof typeMappings] ?? [];
	}
});

const themeToken = theme.useToken().token;
</script>

<template>
	<div
		v-if="textList.length > 0"
		:style="{ 'background-color': themeToken.colorBgContainer }"
		class="w-full relative my-5 px-5 rounded-lg border-4 border-t-sky-400/70 border-x-sky-300/50 border-b-0"
	>
		<img
			src="@/assets/image/instruction-book/explain.png"
			class="absolute top-[-4px] left-[42%]"
			height="30"
			width="142"
			alt="填写说明"
		/>
		<div class="flex">
			<a-list :data-source="textList" class="mt-8 flex-1">
				<template #renderItem="{ item, index }">
					<a-list-item>
						<a-list-item-meta :description="item">
							<template #avatar>
								<img v-show="index === 0" src="@/assets/image/instruction-book/1.png" alt="序号1" />
								<img v-show="index === 1" src="@/assets/image/instruction-book/2.png" alt="序号2" />
								<img v-show="index === 2" src="@/assets/image/instruction-book/3.png" alt="序号3" />
								<img v-show="index === 3" src="@/assets/image/instruction-book/4.png" alt="序号4" />
								<img v-show="index === 4" src="@/assets/image/instruction-book/5.png" alt="序号5" />
								<img v-show="index === 5" src="@/assets/image/instruction-book/6.png" alt="序号6" />
								<img v-show="index === 6" src="@/assets/image/instruction-book/7.png" alt="序号7" />
								<img v-show="index === 7" src="@/assets/image/instruction-book/8.png" alt="序号8" />
								<img v-show="index === 8" src="@/assets/image/instruction-book/9.png" alt="序号9" />
								<img v-show="index === 9" src="@/assets/image/instruction-book/10.png" alt="序号10" />
							</template>
						</a-list-item-meta>
					</a-list-item>
				</template>
			</a-list>
			<a-image
				v-if="type === 'course_standard_design_ideas'"
				:width="300"
				class="h-full"
				src="/images/report/design.png"
				alt="设计图"
			/>
		</div>
	</div>
</template>

<style scoped></style>
