export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
    (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
    (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
  );
}

export async function requestFullscreen(element: HTMLElement = document.documentElement): Promise<boolean> {
  try {
    if (isFullscreen()) return true;

    if (element.requestFullscreen) {
      await element.requestFullscreen();
      return true;
    } else if ((element as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
      await (element as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      return true;
    } else if ((element as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
      await (element as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Fullscreen request rejected or not permitted:', err);
    return false;
  }
}

export async function exitFullscreen(): Promise<boolean> {
  try {
    if (!isFullscreen()) return true;

    if (document.exitFullscreen) {
      await document.exitFullscreen();
      return true;
    } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
      await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Exit fullscreen error:', err);
    return false;
  }
}

export async function toggleFullscreen(): Promise<boolean> {
  if (isFullscreen()) {
    return exitFullscreen();
  } else {
    return requestFullscreen();
  }
}
