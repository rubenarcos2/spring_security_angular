export interface Config {
    id: number,
    name: string,
    value: string,
    title: string,
    description: string,
    domain: string,
    pivot: any,
    isDeleting?: boolean;
}