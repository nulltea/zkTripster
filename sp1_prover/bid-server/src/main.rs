#[macro_use] extern crate rocket;

use rocket::{Rocket, Build};

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

fn rocket() -> Rocket<Build> {
    rocket::build()
        // .mount("/", routes![hello, hello]) // uncomment this to get an error
        // .mount("/", routes![unmanaged]) // uncomment this to get a sentinel error
        .mount("/", routes![index])
}

#[derive(Parser)]
#[group(skip)]
struct Options {
    /// File to read
    #[clap(long, env, default_value = "")]
    proofPath: PathBuf,
}


async fn app(options: Options) -> Result<()> {
    let mut proof = File::open(options.proofPath).await?;
    // verify
    Ok(())
}

fn main() {
    if let Err(e) = rocket().launch().await {
        println!("Whoops! Rocket didn't launch!");
        // We drop the error to get a Rocket-formatted panic.
        drop(e);
    };
}