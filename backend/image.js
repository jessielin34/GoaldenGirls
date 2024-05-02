import { _supabase } from "./client.js";

async function uploadFile(file) {
    const { data, error } = await _supabase.storage.from('image').upload('file_path', file)
    if (error) {
      throw error;
    } else {
      console.log('Upload success');
    }
}

await _supabase.storage.from('image').upload('file_path', file, { //overwrite files that already have a path
    upsert: true,
})
