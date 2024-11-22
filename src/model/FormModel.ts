export interface SelectModel {
    label: string;
    value: string;
};

export interface SelectModelHasChildren {
    label: string;
    value: string;
    key: string;
    children: SelectModelHasChildren[]
};
