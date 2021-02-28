import React from "react";

export function displayVerticalSpace(margin) {
    return <div style={{ margin }}> </div>;
}

export function checker (arr, target) {
    return target.every(v => arr.includes(v));
}

export function noDuplicate(arr) {
    return [...new Set(arr)]
}