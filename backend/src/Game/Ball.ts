
export interface BallTypeBD {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    color: string;
  }

export class Ball {

    constructor(private ballData: BallTypeBD) {}

    toBallType(): BallTypeBD {
        return this.ballData;
    }
}