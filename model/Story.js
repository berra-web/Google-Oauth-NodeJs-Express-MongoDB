const mongoose = require('mongoose'); 

const StorySchema = new mongoose.Schema({ 
    title: {       // GOOGLEID begäran => config.env
        type: String,
        required: true,
        trim: true
    },
    body: {    // om personen vill göra nytt inlogning och sätta image
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createtAt:{   
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Story', StorySchema);