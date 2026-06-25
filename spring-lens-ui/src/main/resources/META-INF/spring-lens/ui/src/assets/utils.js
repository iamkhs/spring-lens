import {NH, NW, NODE_STYLES, DEFAULT_NODE_STYLE} from "./constants.js";

export const css = variableName => getComputedStyle(document.documentElement)
            .getPropertyValue(variableName)
            .trim();

export function getBeanCategory(node) {
    if (!node) return 'leaf';

    const { fullName = '', meta = {} } = node.data || node;
    const lowerName = fullName.toLowerCase();
    const lowerType = (meta.type || '').toLowerCase();

    if (lowerName.includes('adapter') || lowerType.includes('adapter')) {
        return 'adapter';
    }

    if (node.depth !== undefined) {
        if (node.depth <= 2) return 'root';
    } else {
        const record = window.allBeansMap?.get(fullName);
        if (record) {
            const { dependencies = [], dependents = [] } = record;
            if (dependencies.length === 0) return 'leaf';
            if (dependents.length === 0) return 'root';
        }
    }

    const hasChildren = node.children?.length > 0 || node._children?.length > 0;
    return hasChildren ? 'intermediate' : 'leaf';
}

export function nodeStyle(node) {
    return NODE_STYLES[getBeanCategory(node)] || DEFAULT_NODE_STYLE;
}

export function tbLink({ source, target }) {
    const sx = source.x;
    const sy = source.y + NH / 2;
    const tx = target.x;
    const ty = target.y - NH / 2;
    const my = (sy + ty) / 2;
    return `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`;
}

export function lrLink({ source, target }) {
    const sWidth = source.width ?? NW;
    const tWidth = target.width ?? NW;
    const sx = source.y + sWidth / 2;
    const sy = source.x;
    const tx = target.y - tWidth / 2;
    const ty = target.x;
    const mx = (sx + tx) / 2;
    return `M${sx},${sy} C${mx},${sy} ${mx},${ty} ${tx},${ty}`;
}

export const tree = d3.tree();