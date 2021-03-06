use ic_cdk::export::candid::{CandidType, Deserialize};

/// A Document contains an id and content.
#[derive(Clone, Debug, Eq, Ord, PartialEq, PartialOrd, Hash, CandidType, Deserialize)]
pub struct Document {
    /// The id of the document
    pub id: usize,
    /// The title of the document
    pub title: String,
    /// The document's content
    pub content_length: usize,
}

impl Document {
    /// Construct a new Document from an id and content.
    /// Both two arguments can be anything that can be turned into a String.
    pub fn new<T>(id: usize, title: T, content: T) -> Document
        where T: Into<String>
    {
        Document {
            id: id,
            title: title.into(),
            content_length: content.into().len(),
        }
    }

    /// Returns a reference to the document's id
    pub fn id(&self) -> usize {
        self.id
    }

    /// Returns a reference to the document's content
    pub fn content_length(&self) -> usize {
        self.content_length
    }
}
