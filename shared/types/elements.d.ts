/**
 * Shared DTOs for UI elements
 * Can be used by both backend and frontend
 */
export interface ElementStyle {
    backgroundColor?: string;
    color?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: string | number;
    width?: string;
    height?: string;
    cursor?: string;
    [key: string]: string | number | undefined;
}
export interface UIElement {
    id: string;
    type: string;
    text: string;
    style?: ElementStyle;
    placeholder?: string;
    name?: string;
    onClick?: string;
}
export interface HTMLElement {
    id: string;
    html: string;
}
export interface GenerateElementsRequest {
    prompt: string;
}
export interface GenerateElementsResponse {
    elements: HTMLElement[];
    prompt: string;
}
export interface ProcessButtonsRequest {
    buttons: UIElement[];
}
export interface ProcessButtonsResponse {
    buttons: UIElement[];
}
//# sourceMappingURL=elements.d.ts.map