# Bug Fix: Preview Table Overflow

## Problem
The user reported an overflow bug in the preview page where wide tables (extracted from documents) are cut off and extend beyond the container width, breaking the layout. This often happens with tables that have fixed widths or many columns.

## Solution
We need to ensure that the content within the preview area can scroll horizontally if it exceeds the container width, without breaking the parent layout.

### Changes
1.  **Modify `app/dashboard/preview/[tabId]/page.tsx`**:
    *   Target the div traversing `dangerouslySetInnerHTML`.
    *   Add `overflow-x-auto` to allow horizontal scrolling for this container.
    *   Add a specific class or style to ensure tables inside this container don't force the container to expand beyond its parent.

Specifically, we will wrap the content or modify the existing `preview-content` div.
Currently:
```tsx
<div dangerouslySetInnerHTML={{ __html: html || '' }} className="preview-content" />
```
We will change the class to include `overflow-x-auto`.

However, sometimes simply adding `overflow-x-auto` to the prose container isn't enough if the styles are bleeding.
We will add `overflow-x-auto w-full` to the div.

Why this works:
- `overflow-x-auto` adds a scrollbar specifically to the element when its content is too wide.
- `w-full` ensures strict width constraint relative to parent.

I will also update the `prose` configuration if needed, but since `prose` is applied to the parent, modifying the inner div is safer.

### Verification
- The user can check if the table now has a scrollbar or stays within bounds.
