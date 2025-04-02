import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { observer } from "mobx-react";
import { SettingsStore } from "../../stores/settings.store";

// png favicons converted to base64
const base64favicon = {
    digit: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAyIDc5LmE2YTYzOTY4YSwgMjAyNC8wMy8wNi0xMTo1MjowNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMjQxMmYyNy05OTQ2LTg1NDEtODY4Mi1iNjFkNDg5MGI4NWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjVCOUM5MjE5OTQ0MTFFRkI5MUVBNDgwMjAwNTE2NTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjVCOUM5MjA5OTQ0MTFFRkI5MUVBNDgwMjAwNTE2NTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NGU4ZTlkMzEtZmQ3My0wZTRlLTk3MjUtYTJiMzUwMTU0MTI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmUyNDEyZjI3LTk5NDYtODU0MS04NjgyLWI2MWQ0ODkwYjg1YiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq6VwdwAAAGHSURBVHjadFNLTsQwDE2a9DMI1A0za0Ys2CIhcQUOwSE5AxuQmBMgNizYDBsQNC2lbcpzcCoTiUpPTV372X52tFJKC2SAAaxAfEZgACaGB+boEAkoOAfKvu9vtdYrIsmyrLTWnnOCngIjLAcqkb0EqjzPtyAovPc94MjGfl5Ax0DLgXXXdQ8zHpxPgC3jtGmaHduPgUOgCNWJHumcwedb2PxSqrW18IstK5uIiKp1KXRRwl4kdqUSlSmTKorijL8N28J0jDFH0m8hZseoA6m+Qr83KHlNWTEBmopv2/aprutrnDtGGKkkyFlpIjkYx/Ge/pEm0zS1VVVd4fsLaPkdCGQLoSwEvCDgDRVcinKJ6FH9irH5T4NIQBk/ePP+PMMwPKe2lGCmvkHixLZpHqcStkVMK9eSd1yhAidnjf7DG8Sf4i4sZHITaVQb59wdRNxTK7TGeL+TDf/W7FNxjNFisyIRLUyJbHvOSnfhFaJe8EUaWJ+wpTrZRCNupBH2iYPkVQ4EPwIMAOhIteHzgcqcAAAAAElFTkSuQmCC",
    chrome: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAyIDc5LmE2YTYzOTY4YSwgMjAyNC8wMy8wNi0xMTo1MjowNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMjQxMmYyNy05OTQ2LTg1NDEtODY4Mi1iNjFkNDg5MGI4NWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTFGQ0VBNjBGRjlDMTFFRjk4MjVGMTY3QjU4REQ0MTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTFGQ0VBNUZGRjlDMTFFRjk4MjVGMTY3QjU4REQ0MTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjQyOTM1MjItYzgwZS1mZjRmLTg0NTItMzk3YWMxMjFkMzllIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmUyNDEyZjI3LTk5NDYtODU0MS04NjgyLWI2MWQ0ODkwYjg1YiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk1yvDAAAAFNSURBVHjapJM9SwNBEIY9TVBTaqFoIaittsHKwt7yQIv8AEUbmwgWV/gFdoJiZ2VhwMrGf6CpbLQUESTExlIUCecz8G4YN8HCHDzM7tzMuzNze0me5329PIXYkWXZCKYGZSjJ/QF1SHn/7uP7o+R1TAOWYBia8Coh8zUU0ymgF8eqapt9ASZZr7i4QYvxIonNQGU3FTjD/kWiB5gKTESdfpnP2gnK1nMRdlzyPKbaJTlUUvNDXIAWSYcuyPp+0HraDTQ8ZS8wpBb8QO8wc1pfYFajFkrxZ7SewqVowTOc49vHrmk/CjdwCuNe4DMqcQBmYQ+BJ7i0+bjqrnQ32p/n9o/Lthi1VtUBdV9BqhkUXewZ3MOjS57C7GoGafseRBcpVLWM7zo62ZIT2GR/8ktAQRuYI33nb3iT4JjKtpO3QnKHwH9+pqTX3/lHgAEAKWZ+YboIq4IAAAAASUVORK5CYII=",
    edge: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAyIDc5LmE2YTYzOTY4YSwgMjAyNC8wMy8wNi0xMTo1MjowNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMjQxMmYyNy05OTQ2LTg1NDEtODY4Mi1iNjFkNDg5MGI4NWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0M3OTUzNDcwMEVFMTFGMEE1NDdFMzY1QzU3MzY0ODYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0M3OTUzNDYwMEVFMTFGMEE1NDdFMzY1QzU3MzY0ODYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZmZjYzY0MGEtNDQxMy03ZDRhLWJlYTYtM2MxMjA1ZmI1NTAwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmUyNDEyZjI3LTk5NDYtODU0MS04NjgyLWI2MWQ0ODkwYjg1YiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt3C2eAAAACPSURBVHjaYvz//z8DJYAFxmhoaDgKpKyI1HceqN4IzAK5oL6+/jwQTwexYRjI/4/MR5ObBMQnQGwmqIkGQBMziXU2UG0ekDJH8QIWUANUSDiACDkXjzf+I3uBbEB9A0D+hvkdF5uqLhhGgXgSGEDTSUiJILXnQWxGWG4ECp4DUoZEmnEMqN4axQByAUCAAQCmQLi320T7+AAAAABJRU5ErkJggg==",
    transparent:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAyIDc5LmE2YTYzOTY4YSwgMjAyNC8wMy8wNi0xMTo1MjowNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMjQxMmYyNy05OTQ2LTg1NDEtODY4Mi1iNjFkNDg5MGI4NWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTFGQjNDQjRGRjlDMTFFRjk4MjVGMTY3QjU4REQ0MTQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTFGQjNDQjNGRjlDMTFFRjk4MjVGMTY3QjU4REQ0MTQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjQyOTM1MjItYzgwZS1mZjRmLTg0NTItMzk3YWMxMjFkMzllIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmUyNDEyZjI3LTk5NDYtODU0MS04NjgyLWI2MWQ0ODkwYjg1YiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi82z/wAAAAfSURBVHjaYvz//z8DJYCJgUIwasCoAaMGDBYDAAIMAGOaAx1bYuPGAAAAAElFTkSuQmCC",
};

const cfg = {
    folder: "icons-16px",
    icons: ["transparent", "digit", "chrome", "edge"],
    ext: "png",
    href: function (iconName: string) {
        return `./${this.folder}/${iconName}.${this.ext}`; // "./icons-16px/transparent.png"
    },
    href64: function (name: string) {
        if (name === "browser_default") {
            switch (getBrowserName()) {
                case "edge":
                    return base64favicon.edge;
                case "safari":
                case "firefox":
                    return base64favicon.transparent;
                default:
                    return base64favicon.chrome;
            }
        }

        if (Object.keys(base64favicon).includes(name))
            return (base64favicon as any)[name];
        return null;
    },
};

export const Favicon = observer(() => {
    return (
        <HeadPortal>
            <link
                rel="icon"
                type="image/png"
                href={cfg.href64(SettingsStore.favicon)}
            />
        </HeadPortal>
    );
});

type FaviconImageProps = {
    iconName: "digit" | "transparent" | "chrome" | "globe";
};

export const FaviconImage = ({ iconName }: FaviconImageProps) => {
    return <img alt={iconName} src={`${cfg.href64(iconName)}`} />;
};

function HeadPortal({ children }: { children: React.ReactNode }) {
    return createPortal(children, document.head);
}

function getBrowserName() {
    let userAgent = navigator.userAgent;

    if (userAgent.includes("Edg")) {
        return "edge";
    } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
        return "opera";
    } else if (userAgent.includes("Chrome")) {
        return "chrome";
    } else if (userAgent.includes("Safari")) {
        return "safari";
    } else if (userAgent.includes("Firefox")) {
        return "firefox";
    } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
        return "ie";
    } else {
        return "unknown";
    }
}
