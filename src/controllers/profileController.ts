import type { Request, Response } from 'express';
import { getPool } from "../db/conn.js";
import type { NameMeta } from "../model/nameMeta.js"

type Status = {
    status: "success" | "failure",
    data?: NameMeta;
    errorApi?: "Genderize" | "Agify" | "Nationalize";
};

type Country = {
    country_id: string;
    probability: number;
};

const classifyAge = (age: number): "child" | "teenager" | "adult" | "senior" | "invalid" => {
    if (age >= 0 && age <= 12) return "child";
    if (age > 12 && age <= 19) return "teenager";
    if (age > 19 && age <= 59) return "adult";
    if (age > 60) return "senior";
    else return "invalid";  // when the age is less than 0
}

const getNameMetaInformation = async (name: string): Promise<Status> => {
    const genderResponse = await fetch(`https://api.genderize.io?name=${name}`);
    const genderData = await genderResponse.json();
    if (!genderData.gender || genderData.count == 0) {
        return { status: "failure", errorApi: "Genderize" };
    }

    const ageResponse = await fetch(`https://api.agify.io?name=${name}`);
    const ageData = await ageResponse.json();

    if (!ageData.age) return { "status": "failure", "errorApi": "Agify" };
    const ageGroup = classifyAge(Number(ageData.age));
    if (ageGroup == "invalid") return { "status": "failure", "errorApi": "Agify" }

    const nationalityResponse = await fetch(`https://api.nationalize.io?name=${name}`);
    const nationalityData = await nationalityResponse.json();
    if (!nationalityData.country) return { "status": "failure", "errorApi": "Nationalize" };
    // get the country with the highest probability
    const country = nationalityData.country.reduce((acc: Country, current: Country) => current.probability > acc.probability ? current : acc);

    const data: NameMeta = {
        name,
        gender: genderData.gender.toLowerCase(),
        gender_probability: genderData.gender_probability,
        sample_size: genderData.count,
        age: ageData.age,
        age_group: ageGroup,
        country_id: country.country_id.toLowerCase(),
        country_probability: country.country_probability
    };

    return { status: "success", data };
}

const createProfile = async (req: Request, res: Response) => {
    try {
        const pool = getPool();

        const nameRegex = /^[a-zA-Z'-]+$/;  // regex for testing names
        let name = req.body.name;

        if (!name) return res.status(400).json({ "status": "error", "message": "Missing name or bad name" });
        if (typeof (name) != "string") return res.status(400).json({ "status": "error", "message": "Name should be a string" });
        if (!nameRegex.test(name)) return res.status(422).json({ "status": "error", "message": "Unprocessable entity" });

        name = name.toLowerCase();
        const result = await getNameMetaInformation(name);
        if (result.status == "failure") {
            return res.json({ "status": "error", "message": `${!result.errorApi} returned an invalid response` }).status(502);
        }
        const response = result.data!;

        // check if the name exists in the database
        let nameMeta = await pool.query("SELECT * FROM name_metainfo WHERE name=$1", [name]);
        if (nameMeta.rowCount != 0) return res.status(200).json({ "status": "success", message: "Profile already exists", data: nameMeta.rows[0]});

        nameMeta = await pool.query("INSERT INTO name_metainfo (name, gender, gender_probability, sample_size, age, age_group, country_id, country_probability) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *", [response.name, response.gender, response.gender_probability, response.sample_size, response.age, response.age_group, response.country_id, response.country_probability]);

        return res.status(201).json({ "status": "success", "data": nameMeta.rows[0] });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ "status": "error", "message": "Upstream or server failure" });
    }
}

const getProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const pool = getPool();
        const result = await pool.query("select * from name_metainfo where id=$1", [id]);

        return res.json({ "status": "success", "data": result.rows[0] });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ "status": "error", "message": "Upstream or server failure" });
    }
}

const getProfiles = async (req: Request, res: Response) => {
    try {
        const { gender, country_id, age_group } = req.query as {
            gender?: string;
            country_id?: string;
            age_group?: string;
        };

        const pool = getPool();

        const result = await pool.query(
            `SELECT * FROM name_metainfo 
             WHERE ($1::text IS NULL OR gender = $1::text) 
             AND ($2::text IS NULL OR country_id = $2::text) 
             AND ($3::text IS NULL OR age_group = $3::text);`,
            [gender || null, country_id || null, age_group || null]
        );

        return res.json({ status: "success", count: result.rowCount, data: result.rows });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: "error", message: "Upstream or server failure" });
    }
};

const deleteProfile = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;

        const pool = getPool();
        const result = await pool.query("delete from name_metainfo where id=$1", [id]);

        return res.sendStatus(204);
    }
    catch(err){
        return res.status(500).json({ "status": "error", "message": "Upstream or server failure" });
    }
}

export { createProfile, getProfile, getProfiles, deleteProfile }