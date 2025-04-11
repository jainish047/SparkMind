import { api } from "./axiosConfig";

const fetchSkills = async () =>{
    try{
        return api.get("/general/skills")
        // in backend: body.filters.status
    }catch(err){
        console.log("error in projects fetch:->", err)
    }
}

const fetchCountries = async () =>{
    try{
        return api.get("/general/countries")
        // in backend: body.filters.status
    }catch(err){
        console.log("error in projects fetch:->", err)
    }
}

const fetchLanguages = async () =>{
    try{
        return api.get("/general/languages")
        // in backend: body.filters.status
    }catch(err){
        console.log("error in projects fetch:->", err)
    }
}

export {
    fetchSkills,
    fetchCountries,
    fetchLanguages
}