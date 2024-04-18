export interface WorkLog {
    id: number;
    employeeType: string;//select
    employeeName: string;
    cost1: number;
    cost2: number;
    description: string;
}

export const employeeTypes: string[] = [
    '',
    '社員',
    '派遣',
]


// 要素を生成する回数を定義
const numberOfElements = 10;

// 基本となるオブジェクト
const baseObject = {
    employeeType: "社員",
    employeeName: "サンプル 太郎",
    hours: 6,
    cost1: 8,
    cost2: 8,
    employeeTypes: "社員",
};

// IDを連番で割り当てた配列を生成
const data = Array.from({ length: numberOfElements }, (v, i) => ({
    id: i,
    ...baseObject
}));

export const initialWorkhours: WorkLog[] = data.map<WorkLog>(log => ({ ...log, description: '' }))
