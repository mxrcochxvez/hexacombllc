/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "ogl" {
  export class Renderer {
    constructor(options?: any);
    gl: WebGLRenderingContext;
    setSize(width: number, height: number): void;
    render(options: { scene: any; target?: any; clear?: boolean }): void;
  }
  export class Program {
    constructor(gl: WebGLRenderingContext, options: any);
    setBlendFunc(src: number, dst: number): void;
    uniforms: Record<string, { value: any }>;
  }
  export class Geometry {
    constructor(gl: WebGLRenderingContext, attributes: Record<string, any>);
    attributes: Record<string, any>;
  }
  export class Mesh {
    constructor(gl: WebGLRenderingContext, options: any);
  }
  export class Triangle extends Geometry {
    constructor(gl: WebGLRenderingContext);
  }
  export class Texture {
    constructor(gl: WebGLRenderingContext, options?: any);
    image: HTMLImageElement | null;
  }
  export class RenderTarget {
    constructor(gl: WebGLRenderingContext, options?: any);
    texture: Texture;
    setSize(width: number, height: number): void;
  }
}
