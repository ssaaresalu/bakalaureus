export function scrollToTopOfPage(): void {
  document.getElementById(TopOfPageMarker)?.scrollIntoView();
}

export const TopOfPageMarker = 'topOfPage';
