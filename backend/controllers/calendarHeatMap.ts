import { Request, Response } from "express";
import { getHeatmapData } from "../db/heatmapsQueries";


export async function createHeatMap(req: Request, res: Response) {
    const heatmapData = await getHeatmapData(req.params.sub);

    if (!heatmapData || heatmapData.length === 0) {
        return res.status(404).send({ msg: 'There is no data.' });
    }

    return res.status(200).send(heatmapData);
}